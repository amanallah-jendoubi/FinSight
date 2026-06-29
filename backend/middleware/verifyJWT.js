const jwt = require ('jsonwebtoken');
require ('dotenv').config();

//middleware for verifying the access token
const verifyJWT= (req, res, next)=>{
    req.skipRefreshToken = false;
    const authHeader = req.headers.authorization; 
    if (!authHeader) return res.sendStatus(401);
    const accesstoken = authHeader.split(' ')[1];
        jwt.verify( 
        accesstoken,
        process.env.ACCESS_TOKEN_SECRET,
        (err, decodedPayload)=>{
            if (err){
                if (err.message === 'jwt expired'){ //jwt expiration error sends control to refreshToken middleware 
                    return next(); 
                }
                return res.status(403).json({'message': err.message});
            }
            req.skipRefreshToken = true; //passing userName in req object to the next midddleware 
            next();
        }
    );
};



module.exports = verifyJWT; 