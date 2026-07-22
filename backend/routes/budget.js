const express = require ('express');
const router = express.Router ();


/**
 * @swagger
 * /budget:
 *   get:
 *     summary: Get all budgets
 */
router.get('/', require('../controllers/budgetController').getAllBudgets);

/**
 * @swagger
 * /budget:
 *   post:
 *     summary: Create a budget
 */
router.post('/', require('../controllers/budgetController').createBudget);

/**
 * @swagger
 * /budget/{budgetId}:
 *   patch:
 *     summary: Update a budget
 */
router.patch('/:budgetId', require('../controllers/budgetController').updateBudget);

/**
 * @swagger
 * /budget/{budgetId}:
 *   delete:
 *     summary: Delete a budget
 */
router.delete('/:budgetId', require('../controllers/budgetController').deleteBudget);

module.exports = router;