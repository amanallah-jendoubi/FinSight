const pool = require('../config/db');

async function createCategory(categoryName) {
  const result = await pool.query(
    'INSERT INTO "Category" (name) VALUES ($1) RETURNING *',
    [categoryName]
  );
  return result.rows[0];
}

async function getAllCategories() {
  const result = await pool.query('SELECT * FROM "Category"');
  return result.rows;
}

module.exports = { createCategory, getAllCategories };