const express = require("express");
const router = express.Router();
const {
  createOrder,
  getUserOrder,
  getQiwiBill,
  getAllOrders,
  adminOrder,
  editShippingState,
} = require("../controllers/orderController");

router.post("/createOrder", createOrder);
router.get("/user", getUserOrder);
router.post("/getQiwiBill", getQiwiBill);
router.get("/allOrders", getAllOrders);
router.get("/adminOrders", adminOrder);
router.post("/updateShippingState", editShippingState);

module.exports = router;
