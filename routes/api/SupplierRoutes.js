const express = require('express');
const { addSupplier, getSuppliers, getSupplier, deleteSupplier, updateSupplier } = require('../../controllers/SupplierController');
const {supplierValidation} = require('../../validations/supplierValidation');

const router = express.Router();

router.post('/suppliers',supplierValidation,addSupplier);
router.get('/suppliers',getSuppliers);
router.get('/suppliers/:id',getSupplier);
router.put('/suppliers/:id',updateSupplier);
router.delete('/suppliers/:id',deleteSupplier);

module.exports = router;

