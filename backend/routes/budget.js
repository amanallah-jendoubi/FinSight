const express = require ('express');
const router = express.Router ();


router.get('/', require('../controllers/budgetController').getAllBudgets);
router.post('/', require('../controllers/budgetController').createBudget);
module.exports = router;