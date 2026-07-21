const pool = require('../config/db');


async function getUserInfo(userId) {
  const result = await pool.query(
    'SELECT * FROM "User" WHERE id = $1',
    [userId]
  );
  return result.rows;
}


async function updateUserInfo (userId, newPasswordHash) {
  const result = await pool.query(
    'UPDATE "User" SET passwordHash = $1, createdAt = NOW()  WHERE id = $2 RETURNING *',
    [newPasswordHash, userId]
  );
  return result.rows[0];
}


async function deleteUser (userId) {
  const result = await pool.query(
    'DELETE FROM "User" WHERE id = $1',
    [userId]
  );
}




module.exports = {getUserInfo, updateUserInfo, deleteUser };

