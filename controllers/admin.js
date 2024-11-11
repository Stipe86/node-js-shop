const Product = require("../models/product.js");

exports.getAddProduct = (req, res, next) => {
  res.render("admin/add-edit-product", {
    pageTitle: "Add Product",
    path: "/admin/add-product",
    editing: false,
  });
};

exports.postAddProduct = (req, res, next) => {
  const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const price = req.body.price;
  const description = req.body.description;
  const product = new Product(null, title, imageUrl, price, description);
  product.save();
  res.redirect("/admin/products");
};

exports.getEditProduct = (req, res, next) => {
  const editMode = req.query.edit === "true";
  const productId = req.params.productId;
  Product.findById(productId, (product) => {
    res.render("admin/add-edit-product", {
      product: product,
      pageTitle: product.title,
      path: "/admin/edit-product",
      editing: editMode,
    });
  });
};

exports.postEditProduct = (req, res, next) => {
  const id = req.body.productId;
  const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const price = req.body.price;
  const description = req.body.description;

  console.log("Edit Request Data:", {
    id,
    title,
    imageUrl,
    price,
    description,
  });

  const updatedProduct = new Product(id, title, imageUrl, price, description);
  updatedProduct.save();
  res.redirect("/admin/products");
};

exports.postDeleteProduct = (req, res, next) => {
  const id = req.body.productId;
  Product.deleteProduct(id);
  res.redirect("/admin/products");
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
