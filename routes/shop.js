const path = require("path");

const express = require("express");

const rootDir = require("../util/path");
const adminData = require("./admin");

const router = express.Router();

// Old route handler using static HTML file (before Pug integration). This code was used to serve `shop.html` directly from the views folder:
// router.get("/", (req, res, next) => {
//   console.log("shop.js:", adminData.products);
//   res.sendFile(path.join(rootDir, "views", "shop.html"));
// });

// This setup uses Pug as the templating engine to render the `shop.pug` file. Since we set Pug as the default view engine and the `views` folder as the default location, we don’t need to specify the file extension (shop.pug) or the full path to the template (to that folder). Express will automatically look for `shop.pug` in the `views` directory and use it to generate the HTML response
router.get("/", (req, res, next) => {
  const prods = adminData.products;

  res.render("shop", { products: prods, pageTitle: "Shop", path: "/" });
});

module.exports = router;
