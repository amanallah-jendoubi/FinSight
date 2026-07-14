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

async function resolveCategory(client, categoryName) {
  const categoryQuery = `SELECT id FROM "Category" WHERE name = $1`;
  const categoryResult = await client.query(categoryQuery, [categoryName]);

  if (categoryResult.rows.length > 0) {
    return { categoryId: categoryResult.rows[0].id, categoryOverridden: false };
  }

  const insertCategoryQuery = `
    INSERT INTO "Category" (name)
    VALUES ($1)
    RETURNING id
  `;
  const newCategoryResult = await client.query(insertCategoryQuery, [categoryName]);
  return { categoryId: newCategoryResult.rows[0].id, categoryOverridden: true };
}



module.exports = { createCategory, getAllCategories, resolveCategory };