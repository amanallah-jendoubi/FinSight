const express = require('express');
const { Server } = require('socket.io');
const http = require('http');

const app = express(); // request listner
const server = http.createServer(app); // http server
const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173"]
  }
});


const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./swaggerConfig');

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

//jwt verification on the handshake 
const verifySocketJWT = require ('./middleware/verifySocketJWT');
io.use(verifySocketJWT);

io.on('connection', (socket) => {
  socket.join(`user:${socket.userId}`); //join user specific room
  console.log(`Rooms for ${socket.id}:`, [...socket.rooms]); // should show socket.id AND user:125
  socket.on('disconnect', () => {
    console.log(`User ${socket.userId} disconnected`); 
  });
});



const PORT = process.env.PORT || 3500 ;  

//builtin middleware to handle url encoded data in requests
app.use(express.urlencoded({extended: false})); 

// cors
const cors = require('cors');
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));

//built-in middleware for json requests
app.use(express.json());

//middleware for cookies
const cookieParser = require('cookie-parser'); 
app.use(cookieParser()); 


//sign-up
app.use('/signup', require('./routes/signup'));
//login
app.use('/login', require('./routes/login'));


//access token verification 
const verifyJWT = require ('./middleware/verifyJWT');
app.use(verifyJWT);

//Refresh Token Rotation
const refreshToken =require ('./middleware/refreshToken');
app.use(refreshToken);


//protected routes 

app.use ('/account', require('./routes/account'));
app.use('/categories', require('./routes/categories'));
app.use('/transactions', require('./routes/transactions'));
app.use('/budget', require('./routes/budget'));
app.use('/alerts', require('./routes/alerts'));
app.use('/user', require('./routes/user'));
app.use ('/logout', require('./routes/logout'));


//404
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});


server.listen(PORT, () => {
  console.log(`🚀 FinSight backend running on port ${PORT}`);
});



module.exports = {io};