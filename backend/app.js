const express = require('express');
const app = express();
const PORT = process.env.PORT || 3500 ;  

//builtin middleware to handle url encoded data in requests
app.use(express.urlencoded({extended: false})); 

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

//home  
app.use('/', require('./routes/root'));
app.use ('/logout', require('./routes/logout'));


//404
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});


app.listen(PORT, () => {
  console.log(`🚀 FinSight backend running on port ${PORT}`);
});