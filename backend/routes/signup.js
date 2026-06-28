const express = require ('express');
const router = express.Router ();
const register = require ('../controllers/signupController');

router.post('/',register);
module.exports = router ;
