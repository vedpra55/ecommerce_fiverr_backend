const express = require("express");
const router = express.Router();
const {
  createOrder,
  deleterOrder,
  getUserOrder,
  getQiwiBill,
  getAllOrders,
  adminOrder,
  editShippingState,
} = require("../controllers/orderController");

router.post("/createOrder", createOrder);
router.post("/deleteOrder", deleterOrder);
router.get("/user", getUserOrder);
router.post("/getQiwiBill", getQiwiBill);
router.get("/allOrders", getAllOrders);
router.get("/adminOrders", adminOrder);
router.post("/updateShippingState", editShippingState);

module.exports = router;
