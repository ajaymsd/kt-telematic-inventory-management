const { body } = require('express-validator');

const supplierValidation = [
    body('name').notEmpty().withMessage('Supplier name is required'),
    body('contact').notEmpty().withMessage('Contact info is required')
];

module.exports = { supplierValidation };
