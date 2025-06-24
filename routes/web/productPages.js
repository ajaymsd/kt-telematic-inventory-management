const express = require('express');
const { renderProductsListPage, renderProductsAddPage,renderProductEditPage } = require('../../controllers/ProductController');

const router = express.Router();

router.get('/', renderProductsListPage);
router.get('/add',renderProductsAddPage);
router.get('/edit/:id',renderProductEditPage);

module.exports = router;