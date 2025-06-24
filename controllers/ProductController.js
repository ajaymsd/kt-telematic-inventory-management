const { PrismaClient } = require('@prisma/client');
const { validationResult } = require('express-validator');
const prisma = new PrismaClient();

const addProduct = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ error: 'Validation failed', details: errors.array() });
    }

    try {
        const { name, sku, price, quantity, category, supplierId } = req.body;
        const product = await prisma.product.create({
            data: {
                name,
                sku,
                price: parseFloat(price),
                quantity: parseInt(quantity),
                category,
                supplierId: supplierId ? parseInt(supplierId) : null,
                createdBy: req.userId
            }
        });
        res.json({ message: 'Product added successfully', data: product });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to add product' });
    }
};

const getProducts = async (req, res) => {
    try {
        const products = await prisma.product.findMany({
            include: { supplier: true, user: true },
            where:{createdBy:req.userId}
        });
        res.render('products',{products});
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to fetch products' });
    }
};

const getProduct = async (req, res) => {
    try {
        const product = await prisma.product.findUnique({
            where: { id: parseInt(req.params.id) },
            include: { supplier: true, user: true }
        });
        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }
        res.json({ message: 'Product fetched successfully', data: product });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to fetch product' });
    }
};

const updateProduct = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ error: 'Validation failed', details: errors.array() });
    }

    try {
        const { name, price, quantity, category, supplierId } = req.body;
        const product = await prisma.product.update({
            where: { id: parseInt(req.params.id) },
            data: {
                name,
                price: parseFloat(price),
                quantity: parseInt(quantity),
                category,
                supplierId: supplierId ? parseInt(supplierId) : null
            }
        });
        res.json({ message: 'Product updated successfully', data: product });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to update product' });
    }
};

const deleteProduct = async (req, res) => {
    try {
        await prisma.product.delete({
            where: { id: parseInt(req.params.id) }
        });
        res.json({ message: 'Product deleted successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to delete product' });
    }
};

const renderProductsListPage = async(req,res) => {
    try {
        const products = await prisma.product.findMany({
            include: { supplier: true, user: true },
            where:{createdBy:parseInt(req.userId)}
        });
        res.render('products/list',{products});
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to fetch products' });
    }
}

const renderProductsAddPage = async(req,res) => {
    try {
          const suppliers = await prisma.supplier.findMany({
            where: { createdBy: req.userId }
        });

        res.render('products/add',{suppliers});
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to fetch products' });
    }
}

const renderProductEditPage = async(req,res) => {
     try {
        const product = await prisma.product.findUnique({
            where: { id: parseInt(req.params.id) },
            include: { supplier: true, user: true }
        });
        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }
         const suppliers = await prisma.supplier.findMany({
            where: { createdBy: req.userId }
        });
        res.render(`products/edit`,{product,suppliers});
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to fetch product' });
    }
}


module.exports = {
    addProduct,
    getProduct,
    getProducts,
    updateProduct,
    deleteProduct,
    renderProductsListPage,
    renderProductsAddPage,
    renderProductEditPage
};
