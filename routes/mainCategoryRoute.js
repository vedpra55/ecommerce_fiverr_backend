const express = require("express");
const router = express.Router();

const { getMainCategory } = require("../controllers/mainCategoryController");

router.post("/", getMainCategory);

module.exports = router;
