const express = require ('express');
const router = express.Router ();



router.post('/', require('../controllers/accountController').createAccount);
router.get('/:accountId', require('../controllers/accountController').getAccountInfo);
router.get('/', require('../controllers/accountController').getAllAccounts)
module.exports = router;