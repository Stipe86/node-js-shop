const Product = require("../models/product.js");

exports.getIndex = (req, res, next) => {
  res.render("shop/index", {
    pageTitle: "Shop",
    path: "/",
  });
};

exports.getProducts = (req, res, next) => {
  // Passing the anonimous callback function with an argument 'prods' as an argument to fetchAll,
  //and expecting, when it is done its execution, to get the products returned in the 'prods'
  Product.fetchAll((prods) => {
    res.render("shop/product-list", {
      products: prods,
      pageTitle: "All Products",
      path: "/products",
    });
  });
};

// Explanation of the first attempt failure:
// 1. `req.param.productId` is incorrect; the correct syntax is `req.params.productId` to access route parameters.
// 2. Calling `Product.findById(productId)` without a callback ignores that it operates asynchronously.
//    This causes `product` to be `undefined` when passed to `res.render` because `findById` hasn't finished executing.

// exports.getProduct = (req, res, next) => {
//   const productId = req.param.productId;
//   const product = Product.findById(productId);
//   res.render("shop/product-detail", {
//     product: product,
//     pageTitle: product.title,
//     path: "/products",
//   });
// };

exports.getProduct = (req, res, next) => {
  const productId = req.params.productId;
  Product.findById(productId, (product) => {
    res.render("shop/product-detail", {
      product: product,
      pageTitle: product.title,
      path: "/products",
    });
  });
};

exports.getCart = (req, res, next) => {
  res.render("shop/cart", {
    pageTitle: "Your Cart",
    path: "/cart",
  });
};

exports.getOrders = (req, res, next) => {
  res.render("shop/orders", {
    pageTitle: "Your Orders",
    path: "/orders",
  });
};

exports.getCheckout = (req, res, next) => {
  res.render("shop/checkout", {
    pageTitle: "Checkout",
    path: "/checkout",
  });
};
