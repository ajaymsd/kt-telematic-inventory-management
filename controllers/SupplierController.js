const { PrismaClient } = require('@prisma/client');
const { validationResult } = require('express-validator');
const prisma = new PrismaClient();

const addSupplier = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
       const formattedErrors = errors.array().map(err => ({
        field: err.param,
        error: err.msg
    }));

    return res.status(422).json({ errors: formattedErrors });
    }

    try {
        const { name, contact } = req.body;
        const supplier = await prisma.supplier.create({
            data: {
                name,
                contact,
                createdBy: req.userId
            }
        });

        if (supplier) {
          res.redirect('/suppliers');
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to add supplier' });
    }
};

const getSuppliers = async (req, res) => {
    try {
        const suppliers = await prisma.supplier.findMany({
            include: { products: true, user: true },
            where: { createdBy: req.userId},
        });
        res.json({ message: 'Suppliers fetched successfully', data: suppliers });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to fetch suppliers' });
    }
};

const getSupplier = async (req, res) => {
    try {
        const supplier = await prisma.supplier.findUnique({
            where: { id: parseInt(req.params.id) },
            include: { products: true, user: true }
        });
        if (!supplier) {
            return res.status(404).json({ error: 'Supplier not found' });
        }
        res.json({ message: 'Supplier fetched successfully', data: supplier });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to fetch supplier' });
    }
};

const updateSupplier = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ error: 'Validation failed', details: errors.array() });
    }

    try {
        const { name, contact } = req.body;
        const supplier = await prisma.supplier.update({
            where: { id: parseInt(req.params.id) },
            data: { name, contact }
        });
        if (supplier) {
            res.redirect('/suppliers');
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to update supplier' });
    }
};

const deleteSupplier = async (req, res) => {
    try {
        await prisma.supplier.delete({
            where: { id: parseInt(req.params.id) }
        });
        res.redirect('/suppliers');
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to delete supplier' });
    }
};

const renderSuppliersListPage = async(req,res) =>{
     try {
        const suppliers = await prisma.supplier.findMany({
            include: { products: true, user: true },
             where:{createdBy:req.userId}
        });
        res.render('suppliers/list',{suppliers});
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to fetch suppliers' });
    }
}

const renderSuppliersEditPage = async(req,res) => {
    try {
        const supplier = await prisma.supplier.findUnique({
            where: { id: parseInt(req.params.id) },
            include: { products: true, user: true }
        });
        if (!supplier) {
            return res.status(404).json({ error: 'Supplier not found' });
        }
        res.render('suppliers/edit',{supplier});
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to fetch supplier' });
    }
}

const renderSuppliersAddPage = async(req,res) => {
    try {
        res.render('suppliers/add');
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to fetch products' });
    }
}

module.exports = {
    addSupplier,
    getSuppliers,
    getSupplier,
    updateSupplier,
    deleteSupplier,
    renderSuppliersListPage,
    renderSuppliersAddPage,
    renderSuppliersEditPage
};
