const pool = require('../config/db');

async function createAccount(userId, balance, bankName, type) {
  const result = await pool.query(
    'INSERT INTO "Account" (userId, balance, bankName, type) VALUES ($1, $2, $3, $4) RETURNING *',
    [userId, balance, bankName, type]
  );
  return result.rows[0];
}

async function getAccountById(accountId) {
  const result = await pool.query(
    'SELECT * FROM "Account" WHERE "id" = $1',
    [accountId]
  );
  return result.rows[0];
}

async function getAllAccountsByUserId(userId) {
  const result = await pool.query(
    'SELECT * FROM "Account" WHERE userId = $1',
    [userId]
  );

  return {
    count: result.rows.length,
    totalBalance: result.rows.reduce((sum, acc) => sum + parseFloat(acc.balance), 0),
    accounts: result.rows
  };
}

module.exports = { createAccount, getAccountById, getAllAccountsByUserId };

