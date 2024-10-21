const Product = require("../models/product.js");


exports.getProducts = (req, res, next) => {
  // Passing the anonimous callback function with an argument 'prods' as an argument to fetchAll,
  //and expecting, when it is done its execution, to get the products returned in the 'prods'
  Product.fetchAll((prods) => {
    res.render("shop/product-list", {
      products: prods,
      pageTitle: "Shop",
      path: "/",
    });
  });
};
