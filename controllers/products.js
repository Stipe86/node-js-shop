const Product = require("../models/product.js");

exports.getAddProduct = (req, res, next) => {
  res.render("add-product", {
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
  // Passing the anonimous callback function with an argument 'prods' as an argument to fetchAll,
  //and expecting, when it is done its execution, to get the products returned in the 'prods'
  Product.fetchAll((prods) => {
    res.render("shop", {
      products: prods,
      pageTitle: "Shop",
      path: "/",
    });
  });
};
