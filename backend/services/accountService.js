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


async function updateAccount(client, amount, accountId, userId) {
  const updateBalanceQuery = `
    UPDATE "Account"
    SET balance = balance + $1
    WHERE id = $2
    RETURNING balance, bankname, type
    `;
  const result = await client.query(updateBalanceQuery, [amount, accountId]);
  const updatedBalance = result.rows[0]?.balance;
  const type = result.rows[0]?.type;
  const bankName = result.rows[0]?.bankname;
  if (updatedBalance < 50){
    let message;
    let title;
    let alertType;
    if (updatedBalance < 0){
      message = `Your ${type} with ${bankName} is overdrawn by ${updatedBalance} DT`;
      title = `Negative Balance Alert`;
      alertType = "balance_exceeded";
    }
    else{
      message = `Your ${type} with ${bankName} is running low. Current balance: ${updatedBalance} DT`;
      title = `Low Balance Warning`;
      alertType = "balance_low";
    }
    const alertResult = await client.query(
      `INSERT INTO "Alert"
        (message, isread, createdat, ishandled, type, transactionid, budgetid, userid, title)
      VALUES ($1, $2, NOW(), $3, $4, $5, $6, $7, $8)
      RETURNING *`,
      [
        message,
        false,
        null,
        alertType,
        null,
        null,
        userId,
        title,
      ]
    );
    return alertResult.rows[0];//emit after commit
  }
  return null;
}



async function deleteAccount (accountId)  {
  const result = await pool.query(
    'DELETE FROM "Account" WHERE id = $1  RETURNING *',
    [accountId]
  );
  return result.rows[0];
};




module.exports = {
  createAccount,
  getAccountById,
  getAllAccountsByUserId,
  updateAccount,
  deleteAccount
};

