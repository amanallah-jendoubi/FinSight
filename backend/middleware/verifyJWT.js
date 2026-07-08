const jwt = require ('jsonwebtoken');
require ('dotenv').config();

//middleware for verifying the access token
const verifyJWT= (req, res, next)=>{
    req.skipRefreshToken = false;
    const authHeader = req.headers.authorization; 
    if (!authHeader) return next(); // refresh 
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
            req.userId = decodedPayload.userId; //get userId from the payload
            req.skipRefreshToken = true; 
            next();
        }
    );
};



module.exports = verifyJWT; 