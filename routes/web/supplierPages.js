const express = require('express');
const { renderSuppliersListPage,renderSuppliersEditPage,renderSuppliersAddPage } = require('../../controllers/SupplierController');

const router = express.Router();

router.get('/', renderSuppliersListPage);
router.get('/add', renderSuppliersAddPage);
router.get('/edit/:id', renderSuppliersEditPage);

module.exports = router;