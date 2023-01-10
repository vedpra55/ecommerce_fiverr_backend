const Product = require("../models/productModel");
const HMProduct = require("../models/h&mProductModal");

async function getSubCategoryHm(req, res) {
  const mainCategory = req.body.mainCategory;
  const category = req.body.category;

  const subCategory = await HMProduct.find({
    "productDetails.mainCategories.0": mainCategory,
    "productDetails.mainCategories.1": category,
  })
    .select("productDetails.mainCategories.2")
    .distinct("productDetails.mainCategories.2");

  res.json({ data: subCategory });
}

module.exports = { getSubCategoryHm };
