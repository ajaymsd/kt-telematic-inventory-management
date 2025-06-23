const express = require('express');
const app = express();
require('dotenv').config();
const categoryRoutes = require("./routes/CategoryRoutes");
const productRoutes =  require("./routes/ProductRoutes");
const supplierRoutes = require("./routes/SupplierRoutes");
const authRoutes = require("./routes/AuthRoutes");

app.use(express.json());

app.use('/api/v1',categoryRoutes);
app.use('/api/v1',productRoutes);
app.use('/api/v1',supplierRoutes);
app.use('/api/v1',authRoutes);

app.listen(process.env.PORT,()=>{
   console.log("App Listening at PORT:"+process.env.PORT);
});