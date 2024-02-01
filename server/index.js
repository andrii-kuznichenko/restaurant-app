require("dotenv/config");
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const cookieParser = require("cookie-parser");
const connectDB = require("./config/db");
const PORT = process.env.PORT || 4000;
const app = express();

const { createServer } = require("node:http");
const server = createServer(app);

const { Server } = require("socket.io");
const io = new Server(server);
const jwt = require("jsonwebtoken");
const cookie = require("cookie");

const authRouter = require("./routes/table");
const restaurantRouter = require("./routes/restaurants");
const adminRouter = require("./routes/admins");
const mealRouter = require("./routes/meals");

const Meal = require("./modules/meal");
const Restaurant = require("./modules/restaurant");
const Order = require("./modules/order");
const Table = require("./modules/table");
const Admin = require("./modules/admin");
const meal = require("./modules/meal");

app.use(cors({ origin: process.env.FRONTEND_URL, credentials: true }));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/auth", authRouter);
app.use("/admin", adminRouter);
app.use("/dashboard", restaurantRouter);
app.use("/menu", mealRouter);

// const namespaces = {};
// const restaurantId = '65b3b26aef210c44a63af9b2'

// function initRestaurantNamespace(restaurantId) {
//     if (namespaces[restaurantId]) {
//         return namespaces[restaurantId];
//     }

//     const nsp = io.of(`/restaurant-${restaurantId}`);
//     namespaces[restaurantId] = nsp;

//     nsp.on('connection', (socket) => {
//         console.log(`User connected to restaurant ${restaurantId}`);

//         socket.on('join room', (roomType) => {
//             const roomName = `${restaurantId}-${roomType}`;
//             socket.join(roomName);
//         });

//         socket.on('request menu', () => {
//             const menuData = getMenuDataForRestaurant(restaurantId);
//             socket.emit('menu data', menuData);
//         });

//         socket.on('place order', async (order) => {
//             console.log(`Order received in restaurant ${restaurantId}`, order);
//             try {

//               // add condition here //

//               const newOrder = await Order.create({...order});
//               console.log("New order saved:", newOrder);
//               nsp.to(`${restaurantId}-admin`).emit('new order', newOrder);
//             } catch (error) {
//               console.error("Error saving order:", error);
//             }
//         });

//         socket.on('disconnect', () => {
//             console.log(`User disconnected from restaurant ${restaurantId}`);
//         });
//     });

//     return nsp;
// }

// const restaurantIds = ['65b3b26aef210c44a63af9b2'];
// restaurantIds.forEach(initRestaurantNamespace);

io.use((socket, next) => {
  if (socket.handshake.headers.cookie) {
    const cookies = cookie.parse(socket.handshake.headers.cookie);
    const token = cookies.accessToken;

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
      if (err) return next(new Error("Authentication error"));
      socket.user = user;
      next();
    });
  } else {
    next(new Error("Authentication error"));
  }
});

const clients = [];
io.on("connection", (socket) => {
  console.log("Connected:", socket.user);
  clients.push(socket.user);

  //socket of menu managment and receiving it for admin and user
  socket.on("connectToMenu", async (payload) => {
    try {
      const { restaurantId, operation, ...meal } = payload;
      if (
        Object.keys(meal).length !== 0 &&
        socket.user.role === "admin" &&
        operation === "add"
      ) {
        //ADD MEAL STARTS HERE

        const newMeal = await Meal.create({ ...meal });
        const newMenuRestaurant = await Restaurant.updateOne(
          { _id: restaurantId },
          { $push: { menu: newMeal._id.toString() } }
        );
      } else if (
        Object.keys(meal).length !== 0 &&
        socket.user.role === "admin" &&
        operation === "update"
      ) {
        //UPDATE MEAL STARTS HERE

        const { mealId, ...onlyMeal } = meal;
        const updatedMeal = await Meal.findOneAndUpdate(
          { _id: mealId },
          { ...onlyMeal }
        );
      } else if (
        Object.keys(meal).length !== 0 &&
        socket.user.role === "admin" &&
        operation === "hide"
      ) {
        //HIDE MEAL

        const { mealId, hide } = meal;
        const hideMeal = await Meal.findOneAndUpdate(
          { _id: mealId },
          { hide: hide }
        );
      } else if (
        Object.keys(meal).length !== 0 &&
        socket.user.role === "admin" &&
        operation === "delete"
      ) {
        //DELETE MEAL
        const { mealId } = meal;
        const deletedMeal = await Meal.findOneAndDelete({ _id: mealId });
      }

      const menuAdmin = await Restaurant.findById(restaurantId)
        .select("menu")
        .populate("menu");
      io.emit(`getMenuAdmin-${socket.user.restaurantId}`, menuAdmin);

      const menuUser = await Restaurant.findById(restaurantId)
        .select("menu")
        .populate({
          path: "menu",
          match: { hide: false },
        });
      io.emit(`getMenuUser-${socket.user.restaurantId}`, menuUser);
    } catch (error) {
      console.log(error);
      io.emit("getMenuError", error);
    }
  });
  //socket for post orders and there managment
  socket.on("connectToOrder", async (payload) => {
    try {
      const { operation, ...order } = payload;
      if (
        Object.keys(order).length !== 0 &&
        operation === "add" &&
        socket.user.role === "user"
      ) {
        //START ORDER

        const newOrder = await Order.create({ ...order });
      } else if (Object.keys(order).length !== 0 && operation === "update") {
        //UPDATE ORDER STARTS HERE

        const { orderId, ...order } = order;
        const updatedOrder = await Order.findOneAndUpdate(
          { _id: orderId },
          { ...order }
        );
      } else if (
        Object.keys(order).length !== 0 &&
        socket.user.role === "admin" &&
        operation === "change_status"
      ) {
        //CHANGE STATUS OF ORDER

        const { orderId, status } = order;
        const changedOrderStatus = await Order.findOneAndUpdate(
          { _id: orderId },
          { status: status }
        );
      } else if (
        Object.keys(order).length !== 0 &&
        socket.user.role === "admin" &&
        operation === "close"
      ) {
        //CLOSE ORDER
        const { orderId } = order;
        const closedOrder = await Order.findOneAndUpdate(
          { _id: orderId },
          { isClosed: true }
        );
      }

      // //NOTIFY EVERYONE IN RESTAURANT ABOUT NEW ORDER
      // io.emit(`getNewOrder-${socket.user.restaurantId}`, newOrder);

      //SEND TO EVERYONE FULL LIST OF ORDERS IN RESTAURANT

      for await (const user of clients) {
        if (user.restaurantId === socket.user.restaurantId) {
          const orderInfo = await Order.find({
            restaurantId: user.restaurantId,
            tableNumberId: user._id,
            isClosed: false,
          }).populate("meals.name");
          io.emit(`getOrder-${user._id}`, orderInfo);
        }
      }

      const orders = await Order.find({
        restaurantId: socket.user.restaurantId,
      }).populate("meals.name");
      io.emit(`getOrders-${socket.user.restaurantId}`, orders);
    } catch (error) {
      console.log(error);
      io.emit("getOrderError", error);
    }
  });

  socket.on("disconnect", () => {
    const index = clients
      .map((user) => {
        if (user._id === socket.user._id) {
          return user;
        }
      })
      .indexOf();
    clients.splice(index, 1);
    console.log("🔥: A user disconnected");
  });
});

// THE FOLLOWING BLOCK NEED TO BE AFTER ALL THE BACKEND ROUTES!!!!!!!!!!

if (process.env.NODE_ENV === "production") {
  //*Set static folder up in production
  const buildPath = path.join(__dirname, "../client/dist");
  app.use(express.static(buildPath));

  app.get("*", (req, res) => res.sendFile(path.join(buildPath, "index.html")));
}

connectDB().then(() => {
  server.listen(PORT, () => {
    console.log(`server is up on port ${PORT}`);
  });
});
