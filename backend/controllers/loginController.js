const bcrypt = require('bcrypt');
const ms = require('ms');
const { createAccessAndRefreshJwts, findUserByEmail, saveRefreshToken } = require('../services/authService');




const login = async (req, res)=>{
    try{
        const user = await findUserByEmail( req.body.email);
        if (user && await bcrypt.compare(req.body.password, user.passwordhash)) {
            const { accessToken, refreshToken } = createAccessAndRefreshJwts(user);
            await saveRefreshToken(user, refreshToken);
            res.cookie('jwt', refreshToken, { httpOnly: true, maxAge: ms('7d') });
            return res.json({ accessToken }); // to store in memory 
        }
        return res.status(401).json({ 'message': 'please verify your credentials' });
    } catch (err) {
        res.status(500).json({ 'message': err.message });
    }
};

module.exports= login;




