const express = require ('express');
const router = express.Router ();


router.get('/', require('../controllers/budgetController').getAllBudgets);
router.post('/', require('../controllers/budgetController').createBudget);
router.patch('/:budgetId', require('../controllers/budgetController').updateBudget);
router.delete('/:budgetId', require('../controllers/budgetController').deleteBudget);

module.exports = router;