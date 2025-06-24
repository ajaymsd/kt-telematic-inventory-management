const express = require('express');
const { addProduct, getProducts, getProduct, updateProduct, deleteProduct } = require('../../controllers/ProductController');

const router = express.Router();

router.post('/products',addProduct);
router.get('/products',getProducts);
router.get('/products/:id',getProduct);
router.put('/products/:id',updateProduct);
router.delete('/products/:id',deleteProduct);

module.exports = router;

