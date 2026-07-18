const {resolveCategory} =  require ('./categoriesService');
const pool = require('../config/db');


async function updateBudgetSpending(client, userId, categoryId, categoryName, deltaAmount) {
  const result = await client.query(
    `UPDATE "Budget"
     SET moneySpent = moneySpent + $1
     WHERE userId = $2 AND categoryId = $3
     RETURNING id, limitAmount, moneySpent`,
    [deltaAmount, userId, categoryId]
  );

  const budget = result.rows[0];
  if (!budget) return null; // no matching budget for this category => nothing to check
  const percentage = (budget.moneyspent / budget.limitamount) * 100;
  if (percentage <= 80) return null;
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
      title,
    ]
  );

  return alertResult.rows[0]; //  emits AFTER commit succeeds
}



async function createTransaction({ userId ,accountId, amount, date, description, type, source, categoryName }) {
  const client = await pool.connect();
  let newAlert = null;
  try {
    await client.query('BEGIN');
    const parentColumns = ['amount', 'description', 'accountId'];
    const parentValues = [amount, description, accountId];

    if (date !== undefined) {
        parentColumns.push('date');
        parentValues.push(date);
    }

    const placeholders = parentValues.map((_, i) => `$${i + 1}`).join(', ');
    const columnNames = parentColumns.join(', ');
    const parentQuery = `
    INSERT INTO "Transaction" (${columnNames})
    VALUES (${placeholders})
    RETURNING id, amount, TO_CHAR(date, 'YYYY-MM-DD') AS date, isAnomaly, description, accountId
    `;
    const parentResult = await client.query(parentQuery, parentValues);
    const transaction = parentResult.rows[0];
    let child;
    if (type === 'income') {
        const incomeQuery = `
            INSERT INTO "Income" (source, transactionId)
            VALUES ($1, $2)
            RETURNING id, source, transactionId
        `;
        const incomeResult = await client.query(incomeQuery, [source, transaction.id]);
        child = incomeResult.rows[0];
        const updateBalanceQuery = `
            UPDATE "Account"
            SET balance = balance + $1
            WHERE id = $2
            `;
        await client.query(updateBalanceQuery, [amount, accountId]);
    } else {
        const { categoryId, categoryOverridden } = await resolveCategory(client, categoryName);
        const expenseQuery = `
            INSERT INTO "Expense" (categoryOverridden, categoryId, transactionId)
            VALUES ($1, $2, $3)
            RETURNING id, categoryOverridden, categoryId, transactionId
        `;
        const expenseResult = await client.query(expenseQuery, [categoryOverridden, categoryId, transaction.id]);
        child = expenseResult.rows[0];
        const updateBalanceQuery = `
            UPDATE "Account"
            SET balance = balance - $1
            WHERE id = $2
        `;
        await client.query(updateBalanceQuery, [amount, accountId]);
        newAlert = await updateBudgetSpending(client, userId, categoryId, categoryName, amount);
    }
    await client.query('COMMIT');
    if (newAlert) {
      const { io } = require('../app');
      io.to(`user:${userId}`).emit('budget/alerts', newAlert);
    }
    return { ...transaction, type: type , ...child, categoryname: categoryName };
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}


async function getAllTransactions(accountIds) {
  const query = `
    SELECT
      t.id, t.amount, TO_CHAR(t.date, 'YYYY-MM-DD') AS date, t.isAnomaly, t.description, t.accountId,
      'expense' AS type, c.name AS categoryName,
      e.categoryOverridden, e.categoryId, NULL AS source
    FROM "Transaction" t
    JOIN "Expense" e ON e.transactionId = t.id
    JOIN "Category" c ON c.id = e.categoryId
    WHERE t.accountId = ANY($1)

    UNION ALL

    SELECT
      t.id, t.amount, TO_CHAR(t.date, 'YYYY-MM-DD') AS date, t.isAnomaly, t.description, t.accountId,
      'income' AS type, NULL AS categoryName,
      NULL AS categoryOverridden, NULL AS categoryId, i.source
    FROM "Transaction" t
    JOIN "Income" i ON i.transactionId = t.id
    WHERE t.accountId = ANY($1)

    ORDER BY date DESC
  `;
  const result = await pool.query(query, [accountIds]);
  return result.rows;
}


async function getMonthTransactionsCount(accountIds) {
  const query = `
    SELECT COUNT(*) AS count
    FROM "Transaction" t
    WHERE date_trunc('month', t.date) = date_trunc('month', CURRENT_DATE)
      AND t.accountId = ANY($1)
  `;
  const result = await pool.query(query, [accountIds]);
  return parseInt(result.rows[0].count, 10);
}

async function getMonthExpense(accountIds) {
  const query = `
    SELECT COALESCE(SUM(t.amount), 0) AS total
    FROM "Transaction" t
    JOIN "Expense" e ON e.transactionId = t.id
    JOIN "Category" c ON c.id = e.categoryId
    WHERE date_trunc('month', t.date) = date_trunc('month', CURRENT_DATE)
      AND t.accountId = ANY($1)
  `;
  const result = await pool.query(query, [accountIds]);
  return parseFloat(result.rows[0].total);
}


async function getMonthIncome(accountIds) {
  const query = `
    SELECT COALESCE(SUM(t.amount), 0) AS total
    FROM "Transaction" t
    JOIN "Income" i ON i.transactionId = t.id
    WHERE date_trunc('month', t.date) = date_trunc('month', CURRENT_DATE)
      AND t.accountId = ANY($1)
  `;
  const result = await pool.query(query, [accountIds]);
  return parseFloat(result.rows[0].total);
}


async function getTopCategories(accountIds, limit = 3) {
  const query = `
    SELECT
      c.id AS categoryId,
      c.name AS categoryName,
      SUM(t.amount) AS totalSpent
    FROM "Transaction" t
    JOIN "Expense" e ON e.transactionId = t.id
    JOIN "Category" c ON c.id = e.categoryId
    WHERE t.accountId = ANY($1)
      AND date_trunc('month', t.date) = date_trunc('month', CURRENT_DATE)
    GROUP BY c.id, c.name
    ORDER BY totalSpent DESC
    LIMIT $2
  `;
  const result = await pool.query(query, [accountIds, limit]);

  return result.rows.map(row => ({
    name: row.categoryname,
    amount: parseFloat(row.totalspent)
  }));
}


async function getMonthExpenseByCategory(accountIds) {
  const query = `
    WITH category_totals AS (
      SELECT 
        c.name AS name,
        COALESCE(SUM(t.amount), 0) AS amount
      FROM "Transaction" t
      JOIN "Expense" e ON e.transactionId = t.id
      JOIN "Category" c ON c.id = e.categoryId
      WHERE date_trunc('month', t.date) = date_trunc('month', CURRENT_DATE)
        AND t.accountId = ANY($1)
      GROUP BY c.id, c.name
    ),
    total_sum AS (
      SELECT SUM(amount) AS total FROM category_totals
    )
    SELECT 
      ct.name,
      ct.amount,
      CASE 
        WHEN ts.total > 0 THEN ROUND((ct.amount / ts.total) * 100, 2)
        ELSE 0
      END AS value
    FROM category_totals ct
    CROSS JOIN total_sum ts
    ORDER BY ct.amount DESC
  `;
  const result = await pool.query(query, [accountIds]);
  return result.rows; // Returns [{ name: 'Food', amount: 500, value : 45.45 }, ...]
}


async function deleteTransaction({ userId, transactionId, type }) {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const transactionQuery = `
      SELECT id, amount, accountId
      FROM "Transaction"
      WHERE id = $1 
    `;
    const transactionResult = await client.query(transactionQuery, [transactionId]);

    if (transactionResult.rows.length === 0) {
      await client.query('ROLLBACK');
      return null;
    }

    const transaction = transactionResult.rows[0];

    if (type === 'expense') {

      const getExpenseQuery = `
        SELECT categoryId 
        FROM "Expense" 
        WHERE transactionId = $1
      `;
      const expenseResult = await client.query(getExpenseQuery, [transactionId]);
      const categoryId = expenseResult.rows[0].categoryid;
      await client.query(`DELETE FROM "Expense" WHERE transactionId = $1`, [transactionId]);
      const categoryName = (await client.query(
        'SELECT name from "Category" where id = $1',
        [categoryId]
      )).rows[0].name;
      // deleting reduces spending — never crosses the threshold upward, so the
      // returned alert (always null here) is intentionally discarded
      await updateBudgetSpending(client, userId, categoryId, categoryName, -(transaction.amount));

      const updateBalanceQuery = `
        UPDATE "Account"
        SET balance = balance + $1
        WHERE id = $2
      `;
      await client.query(updateBalanceQuery, [transaction.amount, transaction.accountid]);
    } else if (type === 'income') {
      await client.query(`DELETE FROM "Income" WHERE transactionId = $1`, [transactionId]);

      const updateBalanceQuery = `
        UPDATE "Account"
        SET balance = balance - $1
        WHERE id = $2
      `;
      await client.query(updateBalanceQuery, [transaction.amount, transaction.accountid]);
    } else {
      await client.query('ROLLBACK');
      throw new Error(`Invalid transaction type: ${type}`);
    }
    await client.query(`DELETE FROM "Transaction" WHERE id = $1`, [transactionId]);
    await client.query('COMMIT');
    return transaction;
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}



async function updateTransaction(transactionId, { userId ,accountId, amount, date, description, type, source, categoryName }) { 
  const client = await pool.connect();
  let newAlert = null;
  try {
    await client.query('BEGIN');

    const transactionQuery = `
      SELECT
        t.id, t.amount, t.accountId,
        c.name AS oldCategoryName,
        c.id AS oldCategoryId, 
        i.source AS oldSource,
        CASE
          WHEN e.transactionId IS NOT NULL THEN 'expense'
          WHEN i.transactionId IS NOT NULL THEN 'income'
        END AS oldType
      FROM "Transaction" t
      LEFT JOIN "Expense" e ON e.transactionId = t.id
      LEFT JOIN "Category" c ON c.id = e.categoryId
      LEFT JOIN "Income" i ON i.transactionId = t.id
      WHERE t.id = $1
    `;
    const transactionResult = await client.query(transactionQuery, [transactionId]);
    if (transactionResult.rows.length === 0) {
      await client.query('ROLLBACK');
      return null;
    }

    const oldTransaction = transactionResult.rows[0];
    const oldAmount = parseFloat(oldTransaction.amount);
    const oldType = oldTransaction.oldtype;
    const oldAccountId = oldTransaction.accountid;
    const oldCategoryName = oldTransaction.oldcategoryname;
    const oldCategoryId = oldTransaction.oldcategoryid;


    const newAmount = parseFloat(amount);
    const newType = type;
    // reverse the old transaction's effect on the balance, apply the new one
    const reverseAmount = oldType === 'expense' ? oldAmount : -oldAmount;
    const applyAmount = newType === 'expense' ? -newAmount : newAmount;

    await client.query(
      `UPDATE "Account" SET balance = balance + $1 WHERE id = $2`,
      [reverseAmount, oldAccountId]
    );
    await client.query(
      `UPDATE "Account" SET balance = balance + $1 WHERE id = $2`,
      [applyAmount, accountId]
    );

    let child;

    if (newType !== oldType) {
      // type changed 
      if (oldType === 'expense') {
        await client.query(`DELETE FROM "Expense" WHERE transactionId = $1`, [transactionId]);
        await updateBudgetSpending(client, userId, oldCategoryId, oldCategoryName, (-oldAmount));
      } else if (oldType === 'income') {
        await client.query(`DELETE FROM "Income" WHERE transactionId = $1`, [transactionId]);
      }

      if (newType === 'expense') {
        const { categoryId, categoryOverridden } = await resolveCategory(client, categoryName);
        const expenseResult = await client.query(
          `INSERT INTO "Expense" (categoryOverridden, categoryId, transactionId)
           VALUES ($1, $2, $3)
           RETURNING id, categoryOverridden, categoryId, transactionId`,
          [categoryOverridden, categoryId, transactionId]
        );
        newAlert = await updateBudgetSpending(client, userId, categoryId, categoryName, newAmount);
        child = expenseResult.rows[0];
      } else {
        const incomeResult = await client.query(
          `INSERT INTO "Income" (source, transactionId)
           VALUES ($1, $2)
           RETURNING id, source, transactionId`,
          [source, transactionId]
        );
        child = incomeResult.rows[0];
      }
    } else {
      // type unchanged
      if (newType === 'expense') {
        const { categoryId, categoryOverridden } = await resolveCategory(client, categoryName);
        if (categoryName !== oldCategoryName) {
          await updateBudgetSpending(client, userId, oldCategoryId, oldCategoryName, (-oldAmount));
          newAlert = await updateBudgetSpending(client, userId, categoryId, categoryName, newAmount);
          const expenseResult = await client.query(
            `UPDATE "Expense" SET categoryOverridden = $1, categoryId = $2
             WHERE transactionId = $3
             RETURNING id, categoryOverridden, categoryId, transactionId`,
            [categoryOverridden, categoryId, transactionId]
          );
          child = expenseResult.rows[0];
        } else {
          const expenseResult = await client.query(
            `SELECT id, categoryOverridden, categoryId, transactionId FROM "Expense" WHERE transactionId = $1`,
            [transactionId]
          );
          await updateBudgetSpending(client, userId, categoryId, categoryName, (-oldAmount));
          newAlert = await updateBudgetSpending(client, userId, categoryId, categoryName, newAmount);
          child = expenseResult.rows[0];
        }
      } else {
        const incomeResult = await client.query(
          `UPDATE "Income" SET source = $1
           WHERE transactionId = $2
           RETURNING id, source, transactionId`,
          [source, transactionId]
        );
        child = incomeResult.rows[0];
      }
    }

    const updateTransactionQuery = `
      UPDATE "Transaction"
      SET amount = $1,
          date = COALESCE($2, date),
          description = COALESCE($3, description)
      WHERE id = $4
      RETURNING id, amount, TO_CHAR(date, 'YYYY-MM-DD') AS date, isAnomaly, description, accountId
    `;
    const updatedResult = await client.query(updateTransactionQuery, [
      newAmount,
      date,
      description,
      transactionId
    ]);
    const transaction = updatedResult.rows[0];
    await client.query('COMMIT');
    if (newAlert) {
      const { io } = require('../app');
      io.to(`user:${userId}`).emit('budget/alerts', newAlert);
    }
    return { ...transaction, type: newType, ...child , categoryname: categoryName};
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}


/**
 * Filters out transactions that already exist in the DB for this account,
 * based on (date, description, amount) matching.
 * Returns only the transactions that are new.
 */
async function filterNewTransactions({ accountId, transactions }) {
  if (!transactions || transactions.length === 0) return [];

  const dates = transactions.map(t => t.date);
  const minDate = dates.reduce((a, b) => (a < b ? a : b));
  const maxDate = dates.reduce((a, b) => (a > b ? a : b));

  // Narrow the DB scan to the date range of the incoming batch
  const { rows: existing } = await pool.query(
    `SELECT TO_CHAR(date, 'YYYY-MM-DD') AS date, description, amount
     FROM "Transaction"
     WHERE accountid = $1
       AND date BETWEEN $2 AND $3`,
    [accountId, minDate, maxDate]
  );
  const makeKey = (t) => `${t.date}|${t.description.trim().toLowerCase()}|${Number(t.amount).toFixed(2)}`;
  const existingKeys = new Set(existing.map(makeKey));
    return transactions.filter(t => !existingKeys.has(makeKey(t)));
}


async function createTransactions (accountId, transactions){
  try {
    for (const t of transactions) {
      const { amount, date, description, type, source, categoryName} = t;
      await createTransaction( {accountId ,amount, date, description, type, source, categoryName }); 
    }
  } catch (err) {
    throw err ;
  } 
}




module.exports = {
  createTransaction,
  getAllTransactions,
  getMonthTransactionsCount,
  getMonthExpense,
  getMonthIncome,
  getTopCategories,
  getMonthExpenseByCategory,
  deleteTransaction,
  updateTransaction,
  filterNewTransactions,
  createTransactions
};