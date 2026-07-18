const {resolveCategory} =  require ('./categoriesService');
const pool = require('../config/db');


/**
 * Checks a budget row's spending percentage and, if it crosses 80%,
 * inserts an alert and emits it to the user's room.
 * Called after any INSERT/UPDATE that returns a fresh Budget row.
 */
async function checkBudgetThreshold(client, userId, budget, categoryName) {
  const percentage = (budget.moneyspent / budget.limitamount) * 100;
  if (percentage <= 80) return;
  let message;
  let title;
   if (percentage>= 100){
    message = `you have exceeded your ${categoryName} budget by ${budget.moneyspent-budget.limitamount} DT`;
    title = `Budget exceeded : ${categoryName}`;
  } 
  else{
    message = `you've used ${percentage.toFixed(0)}% of your ${categoryName} budget`
    title=`High spending in ${categoryName}`
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
      'budget',
      null,
      budget.id,
      userId,
      title
    ]
  );
  const { io } = require('../app');
  io.to(`user:${userId}`).emit('budget/alerts', alertResult.rows[0]);
}


async function createBudget(userId, categoryName, amount, moneySpent) {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const { categoryId} = await resolveCategory(client, categoryName);
    const result = await client.query(
      'INSERT INTO "Budget" (userId, categoryId, limitAmount, moneySpent) VALUES ($1, $2, $3, $4) RETURNING *',
      [userId, categoryId , amount, moneySpent]
    );
    const budget = result.rows[0];

    await checkBudgetThreshold(client, userId, budget, categoryName);

    await client.query('COMMIT');
    return ({...budget, categoryName});
  }catch(err){
    await client.query('ROLLBACK');
    if (err.code === '23505') {
      throw new Error('A budget for this category already exists.');
    }
    throw err;
  } finally {
    client.release();
  }
}

async function getAllBudgetsByUserId(userId) {
  const result = await pool.query(
    'SELECT b.*, c.name FROM "Budget" as b,"Category" as c WHERE b.userId = $1 and b.categoryId = c.id',
    [userId]
  );
  return result.rows;
}

async function updateBudget(userId, budgetId, updatedAmount) {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const result = await client.query(
      'UPDATE "Budget" SET limitamount = $1 WHERE id = $2 RETURNING *',
      [updatedAmount, budgetId]
    );
    const budget = result.rows[0];
    const categoryName = (await client.query(
      'SELECT name from "Category" where id = $1',
      [budget.categoryid]
    )).rows[0].name;

    await checkBudgetThreshold(client, userId, budget, categoryName);

    await client.query('COMMIT');
    return {...budget, categoryName};
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
}

async function deleteBudget(budgetId) {
  const result = await pool.query(
    'DELETE FROM "Budget" WHERE id = $1',
    [budgetId]
  );
}





module.exports = { createBudget, getAllBudgetsByUserId, updateBudget, deleteBudget };