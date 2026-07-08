const pool = require('../config/db');


async function createTransaction({ accountId, amount, date, description, type, source, categoryName }) {
  const client = await pool.connect();
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
    RETURNING id, amount, date, isAnomaly, description, accountId
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
        const categoryQuery = `SELECT id FROM "Category" WHERE name = $1`;
        const categoryResult = await client.query(categoryQuery, [categoryName]);
        let categoryId;
        let categoryOverridden = false;

        if (categoryResult.rows.length > 0) {
            categoryId = categoryResult.rows[0].id;
        } else {
            const insertCategoryQuery = `
            INSERT INTO "Category" (name)
            VALUES ($1)
            RETURNING id
            `;
            const newCategoryResult = await client.query(insertCategoryQuery, [categoryName]);
            categoryId = newCategoryResult.rows[0].id;
            categoryOverridden = true;
        }

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
    }
    await client.query('COMMIT');
    return { ...transaction, type: type , ...child };
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





module.exports = {
  createTransaction,
  getAllTransactions,
  getMonthTransactionsCount,
  getMonthExpense,
  getMonthIncome,
  getTopCategories,
  getMonthExpenseByCategory
};












