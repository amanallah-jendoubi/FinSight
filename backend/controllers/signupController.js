const bcrypt = require('bcrypt');
const ms = require ('ms');
const { isValidRequest, findUserByEmail, createUser} = require('../services/authService');

const register = async (req, res) => {
    // 1. validate request
    const { isValid, errors } = isValidRequest(req, 'signup');
    if (!isValid) {
        return res.status(400).json({ errors });
    }
    try {
        // 2. check if user already exists in DB
        const existing = await findUserByEmail(req.body.email);
        if (existing) {
            return res.status(409).json({ message: 'user already has an account' });
        }
        // 3. hash password
        const passwordHash = await bcrypt.hash(req.body.password, 10);

        // 4. insert new user into DB
        const {accessToken , refreshToken } =  await createUser (req.body.name, req.body.email, passwordHash);
        res.cookie('jwt', refreshToken, { httpOnly: true, maxAge: ms('7d') });
        return res.json({ accessToken }); // to store in memory 
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

module.exports = register;