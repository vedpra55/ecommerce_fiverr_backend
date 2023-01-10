const express = require("express");
const { getSubCategoryHm } = require("../controllers/subCategoryHm");

const router = express.Router();

router.post("/", getSubCategoryHm);

module.exports = router;
