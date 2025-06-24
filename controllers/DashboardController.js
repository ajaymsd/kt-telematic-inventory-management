const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const renderDashboardPage = async (req, res) => {
    try {
        const user = await prisma.user.findUnique({ where: { id: req.userId } });

        const productsCount = await prisma.product.count({
            where: { createdBy: req.userId }
        });

        const suppliersCount = await prisma.supplier.count({
            where: { createdBy: req.userId }
        });

        const recentProducts = await prisma.product.findMany({
            where: { createdBy: req.userId },
            orderBy: { createdAt: 'desc' },
            take: 5
        });

        res.render('dashboard', {username: user.username,  productsCount, suppliersCount, recentProducts});
    } catch (err) {
        console.error(err);
        res.status(500).send('Failed to load dashboard');
    }
};

module.exports = {renderDashboardPage};
