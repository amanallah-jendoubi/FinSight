const {resolveCategory} =  require ('./categoriesService');
const pool = require('../config/db');


async function createBudget(userId, categoryName, amount, moneySpent) {
  const client = await pool.connect();
  try {
  const { categoryId} = await resolveCategory(client, categoryName);
  const result = await client.query(
    'INSERT INTO "Budget" (userId, categoryId, limitAmount, moneySpent) VALUES ($1, $2, $3, $4) RETURNING *',
    [userId,categoryId , amount, moneySpent]
  );
  return ({...result.rows[0], categoryName});
  }catch(err){
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

async function updateBudget(budgetId, updatedAmount) {
  const result = await pool.query(
    'UPDATE "Budget" SET limitamount = $1 WHERE id = $2 RETURNING *',
    [updatedAmount, budgetId]
  );
  const categoryName  = (await pool.query(
    'SELECT name from "Category" where id = $1',
    [(result.rows[0]).categoryid]
  )).rows[0].name;
  return {...result.rows[0], categoryName};
}

async function deleteBudget(budgetId) {
  const result = await pool.query(
    'DELETE FROM "Budget" WHERE id = $1',
    [budgetId]
  );
}





module.exports = { createBudget, getAllBudgetsByUserId, updateBudget, deleteBudget };
