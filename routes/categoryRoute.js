const express = require("express");
const { getCategories } = require("../controllers/categoryController");
const router = express.Router();

router.post("/", getCategories);

module.exports = router;
