const mongoose = require("mongoose");

const ProductSchema = mongoose.Schema(
  {
    id: { type: String, required: true },
    bundleId: { type: String, required: true },
    productBrand: { type: String, required: false },
    productCategory: { type: String, required: false },
    productDetails: {
      color: {
        colorId: {
          type: String,
        },
        colorName: {
          type: String,
        },
        _id: String,
      },
      colors: [
        {
          colorId: {
            type: String,
          },
          colorName: {
            type: String,
          },
        },
      ],
      description: {
        type: String,
      },
      images: [String],
      mainCategories: [String],
      sizes: [
        {
          sizeName: {
            type: String,
          },
          sizeId: {
            type: String,
          },
          sizeAvailable: {
            type: Boolean,
          },
        },
      ],
      relativeProducts: [String],
      descriptionMore: {
        type: String,
      },
    },
    image: { type: String, required: false },
    productCategories: { type: String },
    productName: { type: String, required: false },
    translatedProductName: { type: String, required: false },
    price: { type: Number, required: false },
    productUrl: { type: String, required: false },
    _is_available: { type: Boolean, required: false },
    _is_parsed: { type: Boolean, required: false },
    isPromo: { type: String, required: false },
    isTranslated: { type: String, required: false },
    totalSales: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

ProductSchema.index(
  { productName: "text", productBrand: "text" },
  { name: "TextIndex" }
);

const HMproducts = mongoose.model("hmproducts", ProductSchema);

module.exports = HMproducts;
