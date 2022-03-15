require('dotenv').config();
const express = require("express");
const app = express();
const cors = require('cors');

const PORT = process.env.PORT || 8080;

//to access request.body in our POST requests
app.use(express.json())

// enable cors
app.use(cors());

//Routes
const warehousesRoutes = require('./routes/warehouses');
app.use('/warehouses', warehousesRoutes);

const inventoryRoutes = require('./routes/inventory');
app.use('/inventory', inventoryRoutes);

// Listening
app.listen(PORT, () => {
    console.log("Server running on port "
    + PORT)
})