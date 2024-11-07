const Product = require("../models/product.js");

exports.getAddProduct = (req, res, next) => {
  res.render("admin/add-product", {
    pageTitle: "Add Product",
    path: "/admin/add-product",
  });
};

exports.postAddProduct = (req, res, next) => {
  const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const price = req.body.price;
  const description = req.body.description;
  const product = new Product(title, imageUrl, price, description);
  product.save();
  res.redirect("/");
};

exports.getEditProduct = (req, res, next) => {
  const productId = req.params.productId;
  Product.findById(productId, (product) => {
    res.render("admin/edit-product", {
      product: product,
      pageTitle: product.title,
      path: "/admin/edit-product",
    });
  });
};

exports.postEditProduct = (req, res, next) => {
  const id = req.body.productId;
  const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const price = req.body.price;
  const description = req.body.description;
  // const product = new Product(title, imageUrl, price, description);
  // product.save();
  console.log("Edit Request Data:", {
    id,
    title,
    imageUrl,
    price,
    description,
  });
  Product.edit(id, title, imageUrl, price, description);
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
