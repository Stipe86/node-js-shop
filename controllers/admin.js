const Product = require("../models/product.js");

exports.getAddProduct = (req, res, next) => {
  res.render("admin/add-product", {
    pageTitle: "Add Product",
    path: "/admin/add-product",
  });
};

exports.postAddProduct = (req, res, next) => {
  const product = new Product(req.body.title);
  product.save();
  res.redirect("/");
};

exports.getProducts = (req, res, next) => {
  Product.fetchAll((prods) => {
    res.render("admin/products", {
      products: prods,
      pageTitle: "Admin Products",
      path: "/admin/products",
    });
  });
};
