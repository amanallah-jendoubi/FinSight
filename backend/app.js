const express = require('express');
const app = express();
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
//logout
app.use ('/logout', require('./routes/logout'));


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


/*app.use('/alerts', require('./routes/alerts'));*/


//404
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});


app.listen(PORT, () => {
  console.log(`🚀 FinSight backend running on port ${PORT}`);
});