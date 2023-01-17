const mongoose = require("mongoose");

const User = require("./userModel");

const OrderSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: false,
      ref: User,
    },
    shippingAddress: {
      userName: {
        type: String,
      },
      email: {
        type: String,
      },
      zipCode: {
        type: String,
      },
      city: {
        type: String,
      },
      state: {
        type: String,
      },
      landMark: {
        type: String,
      },
      phoneNumber: {
        type: Number,
      },
    },

    totalAmount: {
      type: Number,
      required: false,
    },
    shippingPrice: { type: Number, required: false },
    discount: { type: Number, required: false },
    isPaid: { type: Boolean, required: false, default: false },
    products: [
      {
        brand: {
          type: String,
        },
        productId: {
          type: String,
        },
        image: {
          type: String,
        },
        name: {
          type: String,
        },
        selectedSize: {
          type: String,
        },
        totalAmount: {
          type: Number,
        },
        quantity: {
          type: Number,
        },
      },
    ],
    paymentMethod: { type: String, required: false },

    statusDelivery: {
      type: String,
      default: "Заказ не оплачен",
    },
    paidAt: { type: Date },
    statusDeliveryAt: { type: Date },
    qiwiBill: { type: Object },
    billId: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const Order = mongoose.model("Order", OrderSchema);
module.exports = Order;
