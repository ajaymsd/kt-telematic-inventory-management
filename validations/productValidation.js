const { body } = require('express-validator');

const productValidation = [
    body('name').notEmpty().withMessage('Product name is required'),
    body('sku').notEmpty().withMessage('SKU is required'),
    body('price').isFloat({ gt: 0 }).withMessage('Price must be greater than 0'),
    body('quantity').isInt({ min: 0 }).withMessage('Quantity cannot be negative'),
    body('category').notEmpty().withMessage('Category is required'),
    body('supplierId').optional().isInt().withMessage('Supplier ID must be a valid integer')
];

module.exports = { productValidation };