const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');

const prisma = new PrismaClient();

const JWT_SECRET = process.env.JWT_SECRET;

const register = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(422).json({ errors: errors.array() });

    try {
        const { username, email, password } = req.body;

        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) return res.status(400).json({ error: 'Email already registered' });

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await prisma.user.create({
            data: {
                username,
                email,
                password: hashedPassword
            }
        });

        res.redirect('/login');
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Registration failed' });
    }
};

const login = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.redirect('/login?error=Validation%20Failed');

    try {
        const { email, password } = req.body;

        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) return res.redirect('/login?error=Invalid%20email%20or%20password');

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.redirect('/login?error=Invalid%20email%20or%20password');

        const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '7d' });

        res.cookie('token', token, {
            httpOnly: true,
            secure: false,
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        res.cookie('successMessage', 'Login successful', { maxAge: 5000 });
        res.redirect('/dashboard');

    } catch (err) {
        console.error(err);
        res.redirect('/login?error=Something%20went%20wrong');
    }
};

const logout = (req, res) => {
    res.clearCookie('token');
    res.redirect('/login');
};

const renderLoginPage = (req,res) => {
   try {
        res.render('auth/login');
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to fetch products' });
    }
}

const renderRegisterPage = (req,res) => {
    try {
        res.render('auth/register');
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to fetch products' });
    }
}

module.exports = { register, login, logout, renderLoginPage, renderRegisterPage };
