const pool = require('../config/db');


async function getUserInfo(userId) {
  const result = await pool.query(
    'SELECT * FROM "User" WHERE id = $1',
    [userId]
  );

  return result.rows;
}


async function updateUserInfo (userId, newPasswordHash) {
  const client = await pool.connect();
  try {
    const result = await client.query(
      'UPDATE "User" SET passwordHash = $1, createdAt = NOW()  WHERE id = $2 RETURNING *',
      [newPasswordHash, userId]
    );
    return result.rows[0];;
  } catch (err) {
    throw err;
  } 
}





module.exports = {getUserInfo, updateUserInfo };

