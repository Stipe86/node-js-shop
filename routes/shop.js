const path = require("path");

const express = require("express");

const rootDir = require("../util/path");
const adminData = require("./admin");

const router = express.Router();

// router.get("/", (req, res, next) => {
//   console.log("shop.js:", adminData.products);
//   res.sendFile(path.join(rootDir, "views", "shop.html"));
// });

router.get("/", (req, res, next) => {
  const prods = adminData.products;
  res.render("shop", {
    products: prods,
    hasProducts: prods.length > 0,
    pageTitle: "Shop",
    productCSS: true,
    activeShop: true,

    // Use 'layout: false' to prevent this specific view from using the default layout.
    // This is useful when you want a standalone view without any layout wrapping it.
    // layout: false
  });
});

module.exports = router;
