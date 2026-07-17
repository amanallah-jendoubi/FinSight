const jwt = require ('jsonwebtoken');
require ('dotenv').config();


const verifySocketJWT = (socket, next) =>{
    const token = socket.handshake.auth?.token;
    if (!token) {
        return next(new Error('No Accesstoken provided'));
    }
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decodedPayload) => {
        if (err) {
            return next(new Error('Authentication failed'));
        }
        socket.userId = decodedPayload.userId;
        next();
    });
}

module.exports = verifySocketJWT; 