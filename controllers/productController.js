const Product = require("../models/productModel");
const HMProduct = require("../models/h&mProductModal");

async function getProducts(req, res) {
  try {
    const page = req.query.page || 0;
    const bookPerPage = 12;

    const brand = req.body.brand;
    const mainCategory = req.body.mainCategory || null;
    const category = req.body.category || null;
    const subCategory = req.body.subCategory || null;
    const sizes = req.body.sizes || null;
    const sortOption = req.body.sort || null;

    let Modal;
    let queryBrand;
    if (brand === "zara") {
      Modal = Product;
      queryBrand = "ZARA";
    } else if (brand === "h&m") {
      Modal = HMProduct;
      queryBrand = "H&M";
    }

    // mainCategory
    if (mainCategory && !category && !sizes && !subCategory) {
      if (mainCategory.length >= 2) {
        const totalLenght = await Modal.find({
          "productDetails.mainCategories.0": mainCategory,
          "productDetails.sizes": { $elemMatch: { sizeAvailable: true } },
        }).count();
        const products = await Modal.find({
          "productDetails.mainCategories.0": mainCategory,
          "productDetails.sizes": { $elemMatch: { sizeAvailable: true } },
        })
          .skip(page * bookPerPage)
          .limit(bookPerPage)
          .sort(sortOption);

        return res.json({
          from: "gender",
          data: products,
          total: totalLenght,
        });
      } else {
        const totalLenght = await Modal.find({
          "productDetails.mainCategories.0": mainCategory,
          "productDetails.sizes": { $elemMatch: { sizeAvailable: true } },
        }).count();

        const products = await Modal.find({
          "productDetails.mainCategories.0": mainCategory,
          "productDetails.sizes": { $elemMatch: { sizeAvailable: true } },
        })
          .skip(page * bookPerPage)
          .limit(bookPerPage)
          .sort(sortOption);
        return res.json({
          from: "gender",
          data: products,
          total: totalLenght,
        });
      }
    }

    // mainCategory -> category
    if (mainCategory && category && !sizes && !subCategory) {
      const totalLenght = await Modal.find({
        "productDetails.mainCategories.0": mainCategory,
        "productDetails.mainCategories.1": category,
        "productDetails.sizes": { $elemMatch: { sizeAvailable: true } },
      }).count();

      const products = await Modal.find({
        "productDetails.mainCategories.0": mainCategory,
        "productDetails.mainCategories.1": category,
        "productDetails.sizes": { $elemMatch: { sizeAvailable: true } },
      })
        .skip(page * bookPerPage)
        .limit(bookPerPage)
        .sort(sortOption);

      return res.json({
        from: "category",
        data: products,
        total: totalLenght,
      });
    }

    // mainCategory -> category -> subCategory H&M
    if (brand === "h&m") {
      if (mainCategory && category && subCategory && !sizes) {
        const totalLenght = await HMProduct.find({
          "productDetails.mainCategories.0": mainCategory,
          "productDetails.mainCategories.1": category,
          "productDetails.mainCategories.2": subCategory,
          "productDetails.sizes": { $elemMatch: { sizeAvailable: true } },
        }).count();

        const products = await HMProduct.find({
          "productDetails.mainCategories.0": mainCategory,
          "productDetails.mainCategories.1": category,
          "productDetails.mainCategories.2": subCategory,
          "productDetails.sizes": { $elemMatch: { sizeAvailable: true } },
        })
          .skip(page * bookPerPage)
          .limit(bookPerPage)
          .sort(sortOption);

        return res.json({
          from: "subCategory",
          data: products,
          total: totalLenght,
        });
      }
      if (mainCategory && category && subCategory && sizes) {
        const totalLenght = await HMProduct.find({
          "productDetails.mainCategories.0": mainCategory,
          "productDetails.mainCategories.1": category,
          "productDetails.mainCategories.2": subCategory,
          "productDetails.sizes": { $elemMatch: { sizeName: sizes } },
          "productDetails.sizes": { $elemMatch: { sizeAvailable: true } },
        }).count();

        const products = await HMProduct.find({
          "productDetails.mainCategories.0": mainCategory,
          "productDetails.mainCategories.1": category,
          "productDetails.mainCategories.2": subCategory,
          "productDetails.sizes": { $elemMatch: { sizeName: sizes } },
          "productDetails.sizes": { $elemMatch: { sizeAvailable: true } },
        })
          .skip(page * bookPerPage)
          .limit(bookPerPage)
          .sort(sortOption);

        return res.json({
          from: "subCategory sizes",
          data: products,
          total: totalLenght,
        });
      }
    }

    // mainCategory -> category -> sizes
    if (mainCategory && category && sizes && !subCategory) {
      const totalLenght = await Modal.find({
        "productDetails.mainCategories.0": mainCategory,
        "productDetails.mainCategories.1": category,
        "productDetails.sizes": { $elemMatch: { sizeName: sizes } },
        "productDetails.sizes": { $elemMatch: { sizeAvailable: true } },
      }).count();

      const products = await Modal.find({
        "productDetails.mainCategories.0": mainCategory,
        "productDetails.mainCategories.1": category,
        "productDetails.sizes": { $elemMatch: { sizeName: sizes } },
        "productDetails.sizes": { $elemMatch: { sizeAvailable: true } },
      })
        .skip(page * bookPerPage)
        .limit(bookPerPage)
        .sort(sortOption);
      return res.json({
        from: "sizes",
        data: products,
        total: totalLenght,
      });
    }

    // Default Brand query
    const total = await Modal.find({
      productBrand: queryBrand,
      "productDetails.sizes": { $elemMatch: { sizeAvailable: true } },
    }).count();

    const products = await Modal.find({
      productBrand: queryBrand,
      "productDetails.sizes": { $elemMatch: { sizeAvailable: true } },
    })
      .skip(page * bookPerPage)
      .limit(bookPerPage)
      .sort(sortOption);

    return res.json({ data: products, total: total });
  } catch (err) {
    console.log(err.message);
    res.status(401).json({
      message: err.message,
    });
  }
}

async function getSingleProduct(req, res) {
  try {
    const id = req.body.id;
    const brand = req.body.brand;

    let Modal;
    if (brand === "ZARA") Modal = Product;
    else if (brand === "H") Modal = HMProduct;

    const product = await Modal.findById(id);

    res.json({
      data: product,
    });
  } catch (err) {
    res.status(401).json({ message: err.message });
    console.log(err.message);
  }
}

async function getSimilarProducts(req, res) {
  try {
    const brand = req.body.brand || null;
    const mainCategory = req.body.mainCategory || null;
    const category = req.body.category || null;
    const subCategory = req.body.subCategory || null;

    let Modal;
    if (brand === "ZARA") Modal = Product;
    if (brand === "H&M") Modal = HMProduct;

    if (!subCategory) {
      const total = await Modal.find({
        "productDetails.mainCategories.0": mainCategory,
        "productDetails.mainCategories.1": category,
        "productDetails.sizes": { $elemMatch: { sizeAvailable: true } },
      }).count();

      const randomNumber = total * Math.random();

      const similarProducts = await Modal.find({
        "productDetails.mainCategories.0": mainCategory,
        "productDetails.mainCategories.1": category,
        "productDetails.sizes": { $elemMatch: { sizeAvailable: true } },
      })

        .skip(randomNumber)
        .limit(8);

      return res.json({ data: similarProducts });
    }

    if (subCategory) {
      const total = await Modal.find({
        "productDetails.mainCategories.0": mainCategory,
        "productDetails.mainCategories.1": category,
        "productDetails.mainCategories.2": subCategory,
        "productDetails.sizes": { $elemMatch: { sizeAvailable: true } },
      }).count();

      const randomNumber = total * Math.random();

      const similarProducts = await Modal.find({
        "productDetails.mainCategories.0": mainCategory,
        "productDetails.mainCategories.1": category,
        "productDetails.mainCategories.2": subCategory,
        "productDetails.sizes": { $elemMatch: { sizeAvailable: true } },
      })
        .skip(randomNumber)
        .limit(8);

      return res.json({ data: similarProducts });
    }
  } catch (err) {
    console.log(err.message);
    res.status(401).json({ error: err.message });
  }
}

async function getBestSellerProducts(req, res) {
  const brand = req.query.brand;

  let Modal;
  if (brand === "Zara") {
    Modal = Product;
  } else if (brand === "Hm") {
    Modal = HMProduct;
  }

  const products = await Modal.find({
    "productDetails.sizes": { $elemMatch: { sizeAvailable: true } },
  })
    .sort({ totalSales: -1 })
    .limit(4);

  res.json({
    data: products,
  });
}

async function productSearch(req, res) {
  const searchText = req.body.search;

  const result = await Product.find({
    $text: { $search: searchText },
    "productDetails.sizes": { $elemMatch: { sizeAvailable: true } },
  })
    .select("_id")
    .select("productName")
    .select("productBrand")
    .limit(30);

  res.json({
    data: result,
  });
}

async function getProductByColor(req, res) {
  const { brand, id } = req.body;
  let Modal;

  if (brand === "ZARA") Modal = Product;
  if (brand === "H&M") Modal = HMProduct;

  const productId = await Modal.findOne({ id: id }).select("_id");

  res.json({
    data: productId,
  });
}

module.exports = {
  getProducts,
  getSingleProduct,
  getSimilarProducts,
  getBestSellerProducts,
  productSearch,
  getProductByColor,
};
