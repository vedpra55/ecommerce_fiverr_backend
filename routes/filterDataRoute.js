const express = require("express");
const {
  getMainCategory,
  getCategories,
  getSubCategoryHm,
  getSizes,
} = require("../controllers/filterDataController");
const router = express.Router();

router.post("/mainCategory", getMainCategory);
router.post("/category", getCategories);
router.post("/subCategoryHM", getSubCategoryHm);
router.post("/size", getSizes);

module.exports = router;
