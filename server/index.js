require('dotenv/config');
const express = require('express');
const cors = require('cors');
const path = require('path');
const cookieParser = require('cookie-parser');
const connectDB = require('./config/db');

const PORT = process.env.PORT || 4000;
const app = express();

const { createServer } = require('node:http');
const server = createServer(app);

const { Server } = require('socket.io');
const io = new Server(server);
const jwt = require('jsonwebtoken');
const cookie = require('cookie');

const authRouter = require('./routes/table');
const restaurantRouter = require('./routes/restaurant');

const Meal = require('./modules/meal');
const Restaurant = require('./modules/restaurant');
const Order = require('./modules/order');
const Table = require('./modules/table');
const Admin = require('./modules/admin');
const meal = require('./modules/meal');

app.use('/api/restaurant', restaurantRouter);
app.use('/auth', authRouter);


io.use((socket, next) => {
  if (socket.handshake.headers.cookie) {
      const cookies = cookie.parse(socket.handshake.headers.cookie);
      const token = cookies.accessToken;

      jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
          if (err) return next(new Error('Authentication error'));
          socket.user = user;
          next();
      });
  } else {
      next(new Error('Authentication error'));
  }
});

io.on('connection', (socket) => {
  console.log('Connected:', socket.user);

//socket of manu managment and receiving
  socket.on('connectToMenu', async payload => {
    try {
      const { restaurantId, operation, ...meal } = payload;
      if(Object.keys(meal).length !== 0 && socket.user.role === 'admin' && operation === 'add') {   //ADD MEAL STARTS HERE

        const newMeal = await Meal.create({...meal});
        const newMenuRestaurant = await Restaurant.updateOne(
          { _id: restaurantId }, 
          { $push: { menu: newMeal._id.toString() } });

        const menu = await Restaurant.findById(restaurantId).select('menu').populate('menu');
        io.emit('getMenu', menu);

      } else if (Object.keys(meal).length !== 0 && socket.user.role === 'user' && operation === 'update'){ //UPDATE MEAL STARTS HERE
        
        const {mealId, ...onlyMeal} = meal;
        const updatedMeal = await Meal.findOneAndUpdate({ _id: mealId}, {...onlyMeal});

        const menu = await Restaurant.findById(restaurantId).select('menu').populate('menu');
        io.emit('getMenu', menu);

      } else {
        const menu = await Restaurant.findById(restaurantId).select('menu').populate('menu');
        io.emit('getMenu', menu);
      }
    } catch (error) {
      console.log(error);
      io.emit('getMenuError', error);
    }
  });

  socket.on('disconnect', () => {
    console.log('🔥: A user disconnected');
  });
});


// THE FOLLOWING BLOCK NEED TO BE AFTER ALL THE BACKEND ROUTES!!!!!!!!!!

if (process.env.NODE_ENV === 'production') {
  //*Set static folder up in production
  const buildPath = path.join(__dirname, '../client/dist');
  app.use(express.static(buildPath));

  app.get('*', (req, res) => res.sendFile(path.join(buildPath, 'index.html')));
}

connectDB().then(() => {
  server.listen(PORT, () => {
    console.log(`server is up on port ${PORT}`);
  });
});