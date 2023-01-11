const express = require("express");
const app = express();

const userRoutes = require("../routes/userRoutes");
const orderRoutes = require("./orderRoute");

const productRoutes = require("../routes/productRoutes");
const filterDataRoutes = require("./filterDataRoute");

app.use("/account", userRoutes);
app.use("/order", orderRoutes);
app.use("/products", productRoutes);
app.use("/filterData", filterDataRoutes);

module.exports = app;
