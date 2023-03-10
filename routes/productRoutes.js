const express = require("express");
const router = express.Router();

const {
  getProducts,
  getSingleProduct,
  getSimilarProducts,
  getBestSellerProducts,
  productSearch,
  getProductByColor,
} = require("../controllers/productController");
//const { verifyIsLoggedIn } = require("../middleware/verifyAuthToken");

router.post("/", getProducts);
router.post("/singleProducts", getSingleProduct);
router.post("/similarProducts", getSimilarProducts);
router.get("/bestSeller", getBestSellerProducts);
router.post("/search", productSearch);
router.post("/idByColor", getProductByColor);

module.exports = router;
