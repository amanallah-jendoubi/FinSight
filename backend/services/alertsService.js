const pool = require('../config/db');

async function getAllAlerts(userId) {
  const result = await pool.query(
    'SELECT * FROM "Alert" WHERE userId = $1',
    [userId]
  );

  return result.rows;
}

async function getUnreadAlertsCount(userId) {
  const result = await pool.query(
    'SELECT COUNT(*) FROM "Alert" WHERE userId = $1 AND isRead = false',
    [userId]
  );
  return parseInt(result.rows[0].count, 10);
}


async function updateAlert (alertId) {
  const client = await pool.connect();
  try {
    const result = await client.query(
      'UPDATE "Alert" SET isRead = $1 WHERE id = $2 RETURNING *',
      [true, alertId]
    );
    return result.rows[0];;
  } finally {
    client.release();
  }
}




module.exports = { getAllAlerts, getUnreadAlertsCount, updateAlert };

