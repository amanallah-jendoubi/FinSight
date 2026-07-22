const express = require ('express');
const router = express.Router ();
const register = require ('../controllers/signupController');
const validateRequest = require('../middleware/validateRequest');



/**
 * @swagger
 * /signup:
 *   post:
 *     summary: Register a user
 */
router.post('/', validateRequest('signup'), register);
module.exports = router ;
