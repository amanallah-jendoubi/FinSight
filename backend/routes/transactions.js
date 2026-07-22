const express = require ('express');
const router = express.Router ();


/**
 * @swagger
 * /transactions:
 *   get:
 *     summary: Get all transactions
 */
router.get('/', require('../controllers/transactionsController').getAllTransactions); 

/**
 * @swagger
 * /transactions/count:
 *   get:
 *     summary: Get the monthly transaction count
 */
router.get('/count', require('../controllers/transactionsController').getMonthTransactionsCount); 

/**
 * @swagger
 * /transactions/expense/{accountId}:
 *   get:
 *     summary: Get monthly expenses
 */
router.get('/expense{/:accountId}', require('../controllers/transactionsController').getMonthExpense);  

/**
 * @swagger
 * /transactions/income/{accountId}:
 *   get:
 *     summary: Get monthly income
 */
router.get('/income{/:accountId}', require('../controllers/transactionsController').getMonthIncome); 

/**
 * @swagger
 * /transactions/categories/top:
 *   get:
 *     summary: Get the top spending categories
 */
router.get('/categories/top', require('../controllers/transactionsController').getTopCategories);

/**
 * @swagger
 * /transactions/categoriesPercentage:
 *   get:
 *     summary: Get monthly expenses by category
 */
router.get('/categoriesPercentage', require('../controllers/transactionsController').getMonthExpenseByCategory );

/**
 * @swagger
 * /transactions/evolution:
 *   get:
 *     summary: Get the total balance evolution
 */
router.get('/evolution', require('../controllers/transactionsController').getTotalBalanceEvolution);

/**
 * @swagger
 * /transactions/{accountId}:
 *   post:
 *     summary: Create a transaction
 */
router.post('/:accountId', require('../controllers/transactionsController').createTransaction);

/**
 * @swagger
 * /transactions/batch/{accountId}:
 *   post:
 *     summary: Create transactions in a batch
 */
router.post('/batch/:accountId', require('../controllers/transactionsController').createTransactions);

/**
 * @swagger
 * /transactions/import/{accountId}:
 *   post:
 *     summary: Import transactions
 */
router.post('/import/:accountId', require('../controllers/transactionsController').importTransactions);

/**
 * @swagger
 * /transactions/{transactionId}:
 *   put:
 *     summary: Update a transaction
 */
router.put('/:transactionId', require('../controllers/transactionsController').updateTransaction);

/**
 * @swagger
 * /transactions/{transactionId}:
 *   delete:
 *     summary: Delete a transaction
 */
router.delete('/:transactionId', require('../controllers/transactionsController').deleteTransaction);





module.exports = router;