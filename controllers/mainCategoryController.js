const Product = require("../models/productModel");
const HMProduct = require("../models/h&mProductModal");

async function getMainCategory(req, res) {
  try {
    const brand = req.body.brand;

    let Modal;
    if (brand === "zara") Modal = Product;
    else if (brand === "h&m") Modal = HMProduct;

    const categories = await Modal.find({})
      .select("productDetails.mainCategories.0")
      .distinct("productDetails.mainCategories.0");

    res.json({
      data: categories,
    });
  } catch (err) {
    res.status(401).json({
      error: err.message,
    });
  }
}

module.exports = { getMainCategory };
