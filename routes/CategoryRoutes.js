const express = require('express');
const { addCategory, getCategories, getCategory, updateCategory, deleteCategory } = require('../controllers/CategoryController');

const router = express.Router();

router.post('/categories',addCategory);
router.get('/categories',getCategories);
router.get('/categories/:id',getCategory);
router.put('/categories/:id',updateCategory);
router.delete('/categories/:id',deleteCategory);


module.exports = router;

