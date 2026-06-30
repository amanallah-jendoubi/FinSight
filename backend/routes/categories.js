const express = require ('express');
const router = express.Router ();


router.post('/', require('../controllers/categoriesController').createCategory);
router.get('/', require('../controllers/categoriesController').getAllCategories);


module.exports = router ;