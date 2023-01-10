const Product = require("../models/productModel");
const HMProduct = require("../models/h&mProductModal");

async function getCategories(req, res) {
  try {
    const gender = req.body.gender;
    const brand = req.body.brand;

    let Modal;
    if (brand === "zara") Modal = Product;
    else if (brand === "h&m") Modal = HMProduct;

    if (!gender) {
      return res.status(401).json({
        message: "gender is required",
      });
    }

    const categories = await Modal.find({
      "productDetails.mainCategories.0": gender,
    })
      .select("productDetails.mainCategories.1")
      .distinct("productDetails.mainCategories.1");

    res.json({
      data: categories,
      total: categories.length,
    });
  } catch (err) {
    res.status(401).json({
      error: err.message,
    });
  }
}

module.exports = { getCategories };
