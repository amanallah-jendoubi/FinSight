const express = require ('express');
const router = express.Router ();
const login = require ('../controllers/loginController');
const validateRequest = require('../middleware/validateRequest');



/**
 * @swagger
 * /login:
 *   post:
 *     summary: Log in a user
 */
router.post('/', validateRequest('login'), login);
module.exports = router ;