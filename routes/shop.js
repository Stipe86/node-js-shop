const path = require("path");

const express = require("express");

// const rootDir = require("../util/path");
// const adminData = require("./admin");

const productsController = require("../controllers/products");

const router = express.Router();

// Old route handler using static HTML file (before EJS integration). This code was used to serve `shop.html` directly from the views folder:
// router.get("/", (req, res, next) => {
//   console.log("shop.js:", adminData.products);
//   res.sendFile(path.join(rootDir, "views", "shop.html"));
// });

// This setup uses EJS as the templating engine to render the `shop.ejs` file. Since we set EJS as the default view engine and the `views` folder as the default location, we don’t need to specify the file extension (shop.ejs) or the full path to the template (to that folder). Express will automatically look for `shop.ejs` in the `views` directory and use it to generate the HTML response
// router.get("/", (req, res, next) => {
//   console.log("shop.js:", adminData.products);
//   const prods = adminData.products;
//   res.render("shop", {
//     pageTitle: "Shop",
//     products: prods,
//     // shopActive: true,
//     // addProductActive: false,
//     path: "/",
//   });
// });
router.get("/", productsController.getProducts);

module.exports = router;
