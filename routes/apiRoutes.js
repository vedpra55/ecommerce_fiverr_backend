const express = require("express");
const app = express();
const userRoutes = require("../routes/userRoutes");
const productRoutes = require("../routes/productRoutes");
const mainCategoryRoutes = require("../routes/mainCategoryRoute");
const categoryRoutes = require("../routes/categoryRoute");
const sizeRoutes = require("../routes/sizeRoute");
const subCategoryHmRoutes = require("./subCategoryHmRoute");
const orderRoutes = require("./orderRoute");

app.use("/products", productRoutes);

app.use("/account", userRoutes);
app.use("/mainCategory", mainCategoryRoutes);
app.use("/categories", categoryRoutes);
app.use("/sizes", sizeRoutes);
app.use("/subCategoryHm", subCategoryHmRoutes);
app.use("/order", orderRoutes);

module.exports = app;
