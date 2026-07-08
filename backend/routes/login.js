const express = require ('express');
const router = express.Router ();
const login = require ('../controllers/loginController');
const validateRequest = require('../middleware/validateRequest');



router.post('/', validateRequest('login'), login);
module.exports = router ;