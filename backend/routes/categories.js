const express = require ('express');
const router = express.Router ();


/**
 * @swagger
 * /categories:
 *   post:
 *     summary: Create a category
 */
router.post('/', require('../controllers/categoriesController').createCategory);

/**
 * @swagger
 * /categories:
 *   get:
 *     summary: Get all categories
 */
router.get('/', require('../controllers/categoriesController').getAllCategories);


module.exports = router ;