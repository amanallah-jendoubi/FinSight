const pool = require('../config/db');
const jwt = require('jsonwebtoken');




async function findUserByEmail(email) {
  const result = await pool.query(
    'SELECT * FROM "User" WHERE email = $1',
    [email]
  );
  return result.rows[0] ?? null;
}



async function createUser(name, email, passwordHash) {
  const result = await pool.query(
    'INSERT INTO "User" (name, passwordHash, email, createdAt) VALUES ($1, $2, $3, NOW()) RETURNING *',
    [name, passwordHash, email]
  );
  const user = result.rows[0];
  const { accessToken, refreshToken } = createAccessAndRefreshJwts(user);
  await saveRefreshToken(user, refreshToken);
  return { accessToken, refreshToken };
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
  createUser,
  findUserByRefreshToken,
  createAccessAndRefreshJwts,
  saveRefreshToken
}