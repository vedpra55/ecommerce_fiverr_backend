const Order = require("../models/orderModel");
const Product = require("../models/productModel");
const HMProduct = require("../models/h&mProductModal");
const User = require("../models/userModel");
const uuid = require("uuid");

const QiwiBillPaymentsAPI = require("@qiwi/bill-payments-node-js-sdk");
const qiwiApi = new QiwiBillPaymentsAPI(
  "eyJ2ZXJzaW9uIjoiUDJQIiwiZGF0YSI6eyJwYXlpbl9tZXJjaGFudF9zaXRlX3VpZCI6InVvd3h3aC0wMCIsInVzZXJfaWQiOiI3OTY1MzUwMjkwNSIsInNlY3JldCI6ImMzZjczYTI2Zjc1OTM0ZjI2ZGY5Y2E3YzBkOTM3MDlkYzI0NmZhMjU1YTBjY2NhMjllODY1OTBlNjY1ODFmOTgifX0="
);

async function createOrder(req, res) {
  try {
    const {
      products,
      totalAmount,
      shippingPrice,
      discount,
      userId,
      shippingAddress,
    } = req.body;

    const order = await Order.create({
      user: userId,
      shippingAddress: shippingAddress,
      totalAmount: totalAmount,
      shippingPrice: shippingPrice,
      discount: discount,
      isPaid: false,
      products: products,
      paymentMethod: "Payment by card on the site",
    });

    products.map(async (item) => {
      let ProductModal;
      if (item.brand === "H&M") {
        ProductModal = await HMProduct.findById(item.productId).orFail();
      } else if (item.brand === "ZARA") {
        ProductModal = await Product.findById(item.productId);
      }
      await ProductModal.update({
        totalSales: ProductModal.totalSales + parseInt(item.quantity),
      });
    });

    res.json({
      data: order,
    });
  } catch (err) {
    console.log(err.message + "error");
  }
}

async function getUserOrder(req, res) {
  const uid = req.query.uid;

  const orders = await Order.find({ user: uid });

  orders.forEach(async (order) => {
    if (order.billId) {
      const billInfo = await qiwiApi.getBillInfo(order?.billId);
      await order.updateOne({
        _id: order._id,
        isPaid: billInfo.status.value === "PAID" ? true : false,
        qiwiBill: billInfo.status.value === "PAID" ? billInfo : {},
      });
    }
  });

  const newOrders = await Order.find({ user: uid });

  res.json({
    data: newOrders,
  });
}

async function getQiwiBill(req, res) {
  const { orderId } = req.body;

  const order = await Order.findOne({ _id: orderId });

  const QIWI_STYLE_CODE = "Anna-MuP0VwyJIZ";
  const lifetime = qiwiApi.getLifetimeByDay(5);
  const billId = uuid.v4();

  const fields = {
    amount: 1,
    currency: "RUB",
    comment: billId,
    expirationDateTime: lifetime,
    email: order.shippingAddress.email,
    account: order.user,
    customFields: { themeCode: QIWI_STYLE_CODE },
    // successUrl: `http://0.0.0.0:3000/order/${order._id}`
    successUrl: `http://localhost:3000/account?tab=1`,
  };

  const qiwiBill = await qiwiApi.createBill(billId, fields);

  order.billId = billId;
  order.save();

  res.json({
    url: qiwiBill.payUrl,
  });
}

async function getAllOrders(req, res) {
  const uid = req.query.uid;

  const adminUser = await User.findOne({ _id: uid });

  if (!adminUser.isAdmin) {
    return res.json({
      data: "no admin user found",
    });
  }

  if (adminUser.isAdmin) {
    const orders = await Order.find({});
    return res.json({
      data: orders,
    });
  }
}

async function adminOrder(req, res) {
  const uid = req.query.uid;

  const adminUser = await User.findOne({ _id: uid });

  if (!adminUser.isAdmin) {
    return res.json({
      data: "no admin user found",
    });
  }

  if (adminUser.isAdmin) {
    const orders = await Order.find({}).select("_id").select("createdAt");
    const totalOrders = await Order.find({}).count();

    return res.json({
      data: orders,
      totalSales: totalOrders,
    });
  }
}

async function editShippingState(req, res) {
  try {
    const { uid, orderId, shipping } = req.body;

    const adminUser = await User.findOne({ _id: uid });

    if (!adminUser.isAdmin) {
      return res.json({
        data: "no admin user found",
      });
    }

    if (adminUser.isAdmin) {
      await Order.updateOne(
        {
          _id: orderId,
        },
        { statusDelivery: shipping }
      );
      return res.json({
        data: "updated",
      });
    }
  } catch (err) {
    console.log(err);
    res.json({
      data: err.message,
    });
  }
}

module.exports = {
  createOrder,
  getUserOrder,
  getQiwiBill,
  getAllOrders,
  adminOrder,
  editShippingState,
};
