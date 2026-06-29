const pool = require('../config/db');
const Joi = require("joi");
const jwt = require('jsonwebtoken');

function schemas (){
  const loginSchema = Joi.object({
    email: Joi.string().email().required().messages({
      "string.email": "Email is invalid",
      "any.required": "Email is required",
    }),
    password: Joi.string().min(6).required().messages({
      "string.min": "Password must be at least 6 characters",
      "any.required": "Password is required",
    }),
  });

  const signupSchema = loginSchema.keys({
    name: Joi.string().required().messages({
      "any.required": "Name is required"
    }),
  });
  return {login: loginSchema, signup: signupSchema };
}

function isValidRequest(req, type) {
  const allSchemas = schemas()
  const schema = allSchemas[type];
  const { error } = schema.validate(req.body, { abortEarly: false });
  if (error) {
    return {
      isValid: false,
      errors: error.details.map((d) => d.message),
    };
  }
  return { isValid: true, errors: [] };
}


async function findUserByEmail(email) {
  const result = await pool.query(
    'SELECT * FROM "User" WHERE email = $1',
    [email]
  );
  return result.rows[0] ?? null;
}




async function createUser(name, email, passwordHash) {
  await pool.query(
    'INSERT INTO "User" (name, passwordHash, email, createdAt) VALUES ($1, $2, $3, NOW())',
    [name, passwordHash, email]
  );
  const user = await findUserByEmail (email) ;
  const {accessToken, refreshToken} = createAccessAndRefreshJwts (user) ;
  await saveRefreshToken ( user , refreshToken );
  return { accessToken, refreshToken } ;
}



async function findUserByRefreshToken(refreshToken) {
  const result = await pool.query(
    'SELECT * FROM "User" WHERE refreshToken = $1',
    [refreshToken]
  );
  return result.rows[0] ?? null;
}


function createAccessAndRefreshJwts(user) {
    const accessToken = jwt.sign(
        { userId: user.id},
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: '15m' }
    );
    const refreshToken = jwt.sign(
        { userId: user.id },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: '7d' }
    );
    return { accessToken, refreshToken };
}


async function saveRefreshToken(user, refreshToken) {
  await pool.query(
    'UPDATE "User" SET refreshToken = $1 WHERE id = $2',
    [refreshToken, user.id]
  );
}




module.exports = {
  findUserByEmail,
  isValidRequest,
  createUser,
  findUserByRefreshToken,
  createAccessAndRefreshJwts,
  saveRefreshToken
}