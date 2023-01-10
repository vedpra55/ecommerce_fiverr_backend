const Product = require("../models/productModel");
const HMProduct = require("../models/h&mProductModal");

async function getSizes(req, res) {
  try {
    const gender = req.body.gender;
    const category = req.body.category;
    const brand = req.body.brand;
    const subCategory = req.body.subCategory;

    let Modal;
    if (brand === "zara") Modal = Product;
    else if (brand === "h&m") Modal = HMProduct;

    if (!gender) {
      return res.status(401).json({
        message: "gender is required",
      });
    }

    if (!category) {
      return res.status(401).json({
        message: "category is required",
      });
    }

    if (brand === "zara") {
      if (gender && category && !subCategory) {
        const sizes = await Modal.find({
          "productDetails.mainCategories.0": gender,
          "productDetails.mainCategories.1": category,
        })
          .select("productDetails.sizes.sizeName")
          .distinct("productDetails.sizes.sizeName");

        return res.json({
          data: sizes,
          total: sizes.length,
        });
      }
    }

    if (brand === "h&m") {
      if (gender && category && subCategory) {
        const sizes = await Modal.find({
          "productDetails.mainCategories.0": gender,
          "productDetails.mainCategories.1": category,
          "productDetails.mainCategories.2": subCategory,
        })
          .select("productDetails.sizes.sizeName")
          .distinct("productDetails.sizes.sizeName");

        return res.json({
          data: sizes,
          total: sizes.length,
        });
      }
    }
  } catch (err) {
    res.status(401).json({
      error: err.message,
    });
  }
}

module.exports = { getSizes };
