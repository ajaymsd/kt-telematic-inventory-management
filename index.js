const express = require('express');
const path = require("path");
const methodOverride = require('method-override');
const cookieParser = require('cookie-parser');

require('dotenv').config();

const app = express();

const productRoutes = require("./routes/api/ProductRoutes");
const supplierRoutes = require("./routes/api/SupplierRoutes");
const authRoutes = require("./routes/api/AuthRoutes");

const productWebPagesRoutes = require("./routes/web/productPages");
const supplierWebPagesRoutes = require("./routes/web/supplierPages");
const authWebPagesRoutes = require('./routes/web/authPages');
const isAuthenticated = require('./middlewares/IsAuthenticated');
const { renderDashboardPage } = require('./controllers/DashboardController');

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride(function (req, res) {
  if (req.body && typeof req.body === 'object' && '_method' in req.body) {
    const method = req.body._method
    delete req.body._method
    return method
  }
}))

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'public')));

app.use('/api/v1', authRoutes);
app.use('/api/v1', isAuthenticated, productRoutes);
app.use('/api/v1', isAuthenticated, supplierRoutes);

app.use('/products', isAuthenticated, productWebPagesRoutes);
app.use('/suppliers',isAuthenticated, supplierWebPagesRoutes);
app.use(authWebPagesRoutes);

app.get('/dashboard',isAuthenticated,renderDashboardPage);

app.get('/', (req, res) => {
    const token = req.cookies.token;
    if (!token) {
        return res.redirect('/login');
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        return res.redirect('/dashboard');
    } catch (err) {
        res.clearCookie('token');
        return res.redirect('/login');
    }
});

app.listen(process.env.PORT || 3000, () => {
  console.log("App Listening at PORT: " + (process.env.PORT || 3000));
});
