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

async function getCategories(req, res) {
  try {
    const mainCategory = req.body.mainCategory;
    const brand = req.body.brand;

    let Modal;
    if (brand === "zara") Modal = Product;
    else if (brand === "h&m") Modal = HMProduct;

    if (!mainCategory) {
      return res.status(401).json({
        message: "main category is required",
      });
    }

    const categories = await Modal.find({
      "productDetails.mainCategories.0": mainCategory,
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

async function getSizes(req, res) {
  try {
    const brand = req.body.brand;
    const mainCategory = req.body.mainCategory;
    const category = req.body.category;
    const subCategory = req.body.subCategory;

    let Modal;
    if (brand === "zara") Modal = Product;
    else if (brand === "h&m") Modal = HMProduct;

    if (!mainCategory) {
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
      if (mainCategory && category && !subCategory) {
        const sizes = await Modal.find({
          "productDetails.mainCategories.0": mainCategory,
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
      if (mainCategory && category && subCategory) {
        const sizes = await Modal.find({
          "productDetails.mainCategories.0": mainCategory,
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

module.exports = {
  getMainCategory,
  getCategories,
  getSubCategoryHm,
  getSizes,
};
