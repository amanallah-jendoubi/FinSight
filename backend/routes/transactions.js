const express = require ('express');
const router = express.Router ();


router.get('/', require('../controllers/transactionsController').getAllTransactions); 
router.get('/count', require('../controllers/transactionsController').getMonthTransactionsCount); 
router.get('/expense{/:accountId}', require('../controllers/transactionsController').getMonthExpense);  
router.get('/income{/:accountId}', require('../controllers/transactionsController').getMonthIncome); 
router.get('/categories/top', require('../controllers/transactionsController').getTopCategories);
router.get('/categoriesPercentage', require('../controllers/transactionsController').getMonthExpenseByCategory );
router.post('/:accountId', require('../controllers/transactionsController').createTransaction);
router.put('/:transactionId', require('../controllers/transactionsController').updateTransaction);
router.delete('/:transactionId', require('../controllers/transactionsController').deleteTransaction);





module.exports = router;