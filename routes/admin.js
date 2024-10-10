const path = require("path");

const express = require("express");

const rootDir = require("../util/path");

const router = express.Router();

const products = [];

// Old route handler using static HTML file (before Pug integration). This code was used to serve `/add-product.html` directly from the views folder:

// /admin/add-product => GET
// router.get("/add-product", (req, res, next) => {
//   res.sendFile(path.join(rootDir, "views", "add-product.html"));
// });

// This setup uses Pug as the templating engine to render the `add-product.pug` file. Since we set Pug as the default view engine and the `views` folder as the default location, we don’t need to specify the file extension (add-product.pug) or the full path to the template (to that folder). Express will automatically look for `add-product.pug` in the `views` directory and use it to generate the HTML response
router.get("/add-product", (req, res, next) => {
  res.render("add-product", {
    pageTitle: "Add Product",
    path: "/admin/add-product",
  });
});

// /admin/add-product => POST
router.post("/add-product", (req, res, next) => {
  // console.log(req.body);
  products.push({ title: req.body.title });
  res.redirect("/");
});

// module.exports = router;
exports.routes = router;
exports.products = products;
