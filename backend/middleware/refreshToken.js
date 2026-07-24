const path = require ('path');
const jwt = require ('jsonwebtoken');
const ms = require('ms');
require('dotenv').config();
const { findUserByRefreshToken, createAccessAndRefreshJwts, saveRefreshToken } = require('../services/authService');




const refreshToken =  async (req, res, next)=>{
    if (req.skipRefreshToken) return next(); 
    const oldRefreshToken = req.cookies.jwt;
    if (!oldRefreshToken) return res.sendStatus(401);
    const user = await findUserByRefreshToken(oldRefreshToken);
    if (!user) return res.status(403).json({ error : 'Invalid refresh token' });//wrong refresh token => logout (delete refreshToken from Db)
    jwt.verify(
        oldRefreshToken,
        process.env.REFRESH_TOKEN_SECRET,
        async (err) => {
            if (err) {
               return res.status(403).json({ error : 'Invalid refresh token' }); // fires when refreshToken has expired => logout
            }
            const { accessToken, refreshToken } = createAccessAndRefreshJwts(user);
            try {
                await saveRefreshToken(user, refreshToken);
                res.cookie('jwt', refreshToken, { httpOnly: true, maxAge: ms('7d') });
                return res.json({ 
                        accessToken,
                        message: 'Token refreshed successfully'
                });                
            } catch (err) {
                return res.sendStatus(500);
            }
        }
    );
}
module.exports = refreshToken;




