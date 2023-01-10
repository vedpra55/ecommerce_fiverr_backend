const express = require("express");
const { getSizes } = require("../controllers/sizeController");

const router = express.Router();

router.post("/", getSizes);

module.exports = router;
