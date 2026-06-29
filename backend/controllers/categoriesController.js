const categoryService = require('../services/categoriesService');

const createCategory = async (req, res) => {
  try {
    const { categoryName } = req.body;
    const category = await categoryService.createCategory(categoryName);
    res.status(201).json(category);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


const getAllCategories = async (req, res) => {
  try {
    const categories = await categoryService.getAllCategories();
    res.json(categories);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


module.exports = {createCategory, getAllCategories} ;