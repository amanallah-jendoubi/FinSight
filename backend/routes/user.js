const express = require ('express');
const validateRequest = require('../middleware/validateRequest');
const router = express.Router ();

router.get('/', require('../controllers/userController').getUserInfo)
router.patch('/', validateRequest('password'), require('../controllers/userController').updateUserInfo);

module.exports = router;