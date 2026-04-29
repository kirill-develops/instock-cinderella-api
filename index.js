// require("dotenv").config();
const express = require("express");
const app = express();
const helmet = require("helmet");
const cors = require("cors");

const PORT = process.env.PORT || 8080;
const corsOrigins = process.env.CORS_ORIGINS
   ? process.env.CORS_ORIGINS.split(",").map((origin) => origin.trim())
   : null;
const corsOptions = corsOrigins?.length
   ? { origin: corsOrigins }
   : { origin: true };

app.disable("x-powered-by");
app.use(express.json({ limit: "1mb" }));
app.use(helmet());
app.use(cors(corsOptions));

const warehousesRoutes = require("./routes/warehouses-routes");
const inventoryRoutes = require("./routes/inventory-routes");

app.use("/warehouses", warehousesRoutes);
app.use("/inventory", inventoryRoutes);

app.use((_req, res) => {
   return res.status(404).json({ message: "Route not found" });
});

app.use((err, _req, res, _next) => {
   console.error(err);
   return res.status(err.status || 500).json({
      message: err.status ? err.message : "Internal server error",
   });
});

app.listen(PORT, () => {
   console.log(`Server running on port ${PORT}`);
});
