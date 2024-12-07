const Product = require("../models/product.js");

exports.getIndex = (req, res, next) => {
  res.render("shop/index", {
    pageTitle: "Shop",
    path: "/",
  });
};

exports.getProducts = (req, res, next) => {
  Product.findAll()
    .then((prods) => {
      res.render("shop/product-list", {
        products: prods,
        pageTitle: "All Products",
        path: "/products",
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.getProduct = (req, res, next) => {
  const productId = req.params.productId;

  Product.findByPk(productId)
    .then((product) => {
      res.render("shop/product-detail", {
        product: product,
        pageTitle: product.title,
        path: "/products",
      });
    })
    .catch((err) => {
      console.log(err);
    });

  // An alternative way using findAll
  // Product.findAll({ where: { id: productId } })
  //   .then((products) => {
  //     res.render("shop/product-detail", {
  //       product: products[0],
  //       pageTitle: products[0].title,
  //       path: "/products",
  //     });
  //   })
  //   .catch((err) => console.log(err));
};

exports.getCart = (req, res, next) => {
  req.user
    .getCart()
    .then((cart) => {
      return cart.getProducts(); // another magic method added by a sequelize
    })
    .then((cartProducts) => {
      let total = 0;

      cartProducts.forEach((p) => {
        total += p.cartItem.quantity * p.price;
      });

      res.render("shop/cart", {
        pageTitle: "Your Cart",
        path: "/cart",
        products: cartProducts,
        total: total,
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.postDeleteFromCart = (req, res, next) => {
  const productId = req.body.productId;

  req.user
    .getCart()
    .then((cart) => {
      return cart.getProducts({ where: { id: productId } });
    })
    .then((products) => {
      const product = products[0];
      return product.cartItem.destroy();
    })
    .then((result) => {
      res.redirect("/cart");
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.postCart = (req, res, next) => {
  const productId = req.body.productId;
  let fetchedCart;
  let newQuantity = 1;

  req.user
    .getCart() // Get the cart associated with the user
    .then((cart) => {
      fetchedCart = cart; // Cache the cart instance
      return cart.getProducts({ where: { id: productId } }); // Look for the product in the cart
    })
    .then((products) => {
      let product;

      if (products.length > 0) {
        product = products[0];
        // Since the logic in if (products.length > 0) already ensures product exists
        //when accessing cartItem it can be written here omiting the if(product) check below
        // newQuantity = product.cartItem.quantity + 1;
        // return product;
      }

      // The if (product) check is a safeguard against unexpected scenarios, even if the scenario where it’s needed is rare
      if (product) {
        const oldQuantity = product.cartItem.quantity;
        // newQuantity = oldQuantity++ // oldQuantity++ is a post-increment operator. It means the current value of oldQuantity is assigned to newQuantity before oldQuantity is incremented  (newQuantity = 1, oldQuantity = 2)
        newQuantity = oldQuantity + 1; // Increment quantity
        return product; // Return the existing product
      }

      // If product is not in the cart, fetch it from the database
      return Product.findByPk(productId);
    })
    .then((product) => {
      // Add or update the product in the cart
      return fetchedCart.addProduct(product, {
        through: { quantity: newQuantity },
      });
    })
    .then(() => {
      res.redirect("/cart"); // Redirect to the cart page
    })
    .catch((err) => {
      console.log(err); // Log potential errors
    });
};

exports.postOrder = (req, res, next) => {
  let productsToOrder; // Temporary variable to store products from the cart
  let fetchedCart; // Variable to store the fetched cart for later clearing

  req.user
    .getCart() // Step 1: Fetch the cart associated with the user
    .then((cart) => {
      fetchedCart = cart;
      return cart.getProducts(); // Step 2: Fetch all products from the cart
    })
    .then((products) => {
      productsToOrder = products; // Save the products to a variable for later use
      return req.user.createOrder(); // Step 3: Create a new order for the user
    })
    .then((order) => {
      // Step 4: Add products to the created order with their quantities
      return order.addProducts(
        productsToOrder.map((product) => {
          // For each product, attach a temporary 'orderItem' object containing the quantity from 'cartItem'
          // This 'orderItem' object is used by Sequelize to populate the junction table 'orderItem'
          product.orderItem = { quantity: product.cartItem.quantity };
          return product; // Return the modified product object
        })
      );
    })
    .then((result) => {
      return fetchedCart.setProducts(null); // Step 5: Clear the cart by dissociating all products from it
    })
    .then((result) => {
      res.redirect("/orders"); // Step 6: Redirect the user to the orders page
    })
    .catch((err) => console.log(err)); // Log any errors that occur in the process
};

exports.getOrders = (req, res, next) => {
  // Step 1: Fetch orders for the current user
  req.user
    .getOrders({ include: ["products"] })
    // The 'include' option ensures related 'products' are eagerly loaded along with the orders.
    // This utilizes Sequelize associations to fetch both orders and their associated products
    // in a single database query, improving efficiency and simplifying the code.

    .then((orders) => {
      // Step 2: Render the orders page
      // Pass the fetched orders to the 'shop/orders' template for display
      res.render("shop/orders", {
        pageTitle: "Your Orders", // Dynamic title for the page
        path: "/orders", // Active navigation path for highlighting
        orders: orders, // Orders data, including associated products, to be displayed on the page
      });
    })
    .catch((err) => {
      // Log any errors encountered during the process
      console.log(err);
    });
};

exports.getCheckout = (req, res, next) => {
  res.render("shop/checkout", {
    pageTitle: "Checkout",
    path: "/checkout",
  });
};
