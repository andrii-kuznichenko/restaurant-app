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
  // Now you have a socket connection with an authenticated user
  console.log('Connected:', socket.user);

  socket.on('connectToMenu', async payload => {
    try {
      const {restaurantId} = payload;
      const menu = await Restaurant.findById(restaurantId).select('menu').populate('menu');
      console.log('21211221', menu);
      io.emit('getMenu', menu);
    } catch (error) {
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