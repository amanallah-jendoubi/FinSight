const express = require ('express');
const router = express.Router ();



/**
 * @swagger
 * /account:
 *   post:
 *     summary: Create an account
 */
router.post('/', require('../controllers/accountController').createAccount);

/**
 * @swagger
 * /account/{accountId}:
 *   get:
 *     summary: Get account information
 */
router.get('/:accountId', require('../controllers/accountController').getAccountInfo);

/**
 * @swagger
 * /account:
 *   get:
 *     summary: Get all accounts
 */
router.get('/', require('../controllers/accountController').getAllAccounts);

/**
 * @swagger
 * /account/{accountId}:
 *   delete:
 *     summary: Delete an account
 */
router.delete('/:accountId', require('../controllers/accountController').deleteAccount);
module.exports = router;