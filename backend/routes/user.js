const express = require ('express');
const validateRequest = require('../middleware/validateRequest');
const router = express.Router ();

/**
 * @swagger
 * /user:
 *   get:
 *     summary: Get user information
 */
router.get('/', require('../controllers/userController').getUserInfo)

/**
 * @swagger
 * /user:
 *   patch:
 *     summary: Update user information
 */
router.patch('/', validateRequest('password'), require('../controllers/userController').updateUserInfo);

/**
 * @swagger
 * /user:
 *   delete:
 *     summary: Delete the current user
 */
router.delete('/', require('../controllers/userController').deleteUser);
module.exports = router;