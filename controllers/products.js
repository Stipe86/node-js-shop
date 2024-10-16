// const products = [];

const Product = require("../models/product.js");

// exports.getAddProduct = (req, res, next) => {
//   res.render("add-product", {
//     pageTitle: "Add Product",
//     path: "/admin/add-product",
//   });
// };

// exports.postAddProduct = (req, res, next) => {
//   products.push({ title: req.body.title });
//   res.redirect("/");
// };

// exports.getProducts = (req, res, next) => {
//   res.render("shop", {
//     pageTitle: "Shop",
//     products: products,
//     path: "/",
//   });
// };

exports.getAddProduct = (req, res, next) => {
  res.render("add-product", {
    pageTitle: "Add Product",
    path: "/admin/add-product",
  });
};

exports.postAddProduct = (req, res, next) => {
  // products.push({ title: req.body.title });
  const product = new Product(req.body.title);
  product.save();
  res.redirect("/");
};

exports.getProducts = (req, res, next) => {
  const prods = Product.fetchAll();
  res.render("shop", {
    products: prods,
    pageTitle: "Shop",
    path: "/",
  });
};
