const Product = require("../models/product.js");

const Cart = require("../models/cart.js");

exports.getIndex = (req, res, next) => {
  res.render("shop/index", {
    pageTitle: "Shop",
    path: "/",
  });
};

exports.getProducts = (req, res, next) => {
  Product.fetchAll((prods) => {
    res.render("shop/product-list", {
      products: prods,
      pageTitle: "All Products",
      path: "/products",
    });
  });
};

exports.getProduct = (req, res, next) => {
  const productId = req.params.productId;
  Product.findById(productId, (product) => {
    res.render("shop/product-detail", {
      product: product,
      pageTitle: product.title,
      path: "/products",
    });
  });
};

exports.getCart = (req, res, next) => {
  Cart.fetchCartFromFile((cart) => {
    Product.fetchAll((products) => {
      const cartProducts = [];

      for (product of products) {
        const cartProductData = cart.products.find(
          (prod) => prod.id === product.id
        );

        if (cartProductData) {
          cartProducts.push({
            productData: product,
            quantity: cartProductData.quantity,
          });
          console.log("CartProducts: ", cartProducts);
          console.log("CartProductData:", cartProductData);
        }
      }
      res.render("shop/cart", {
        pageTitle: "Your Cart",
        path: "/cart",
        products: cartProducts,
        total: cart.totalPrice,
      });
    });
  });
};

exports.postDeleteFromCart = (req, res, next) => {
  const productId = req.body.productId;

  Cart.deleteProductFromCart(productId);
  res.redirect("/cart");
};

exports.postCart = (req, res, next) => {
  const productId = req.body.productId;

  Product.findById(productId, (product) => {
    Cart.addToCart(productId, product.price);
  });

  res.redirect("/cart");
};

exports.getOrders = (req, res, next) => {
  res.render("shop/orders", {
    pageTitle: "Your Orders",
    path: "/orders",
  });
};

exports.getCheckout = (req, res, next) => {
  res.render("shop/checkout", {
    pageTitle: "Checkout",
    path: "/checkout",
  });
};
