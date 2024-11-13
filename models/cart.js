const fs = require("fs");

const path = require("path");

const rootDir = require("../util/path.js");

const filePath = path.join(rootDir, "data", "cart.json");

module.exports = class Cart {
  static addToCart(prodId, prodPrice) {
    fs.readFile(filePath, (err, fileContent) => {
      let cart = { products: [], totalPrice: 0 };

      if (!err) {
        try {
          cart = JSON.parse(fileContent);
        } catch (parseError) {
          console.log("Error parsing cart.json:", parseError);
        }
      }

      const existingProductIndex = cart.products.findIndex(
        (p) => p.id === prodId
      );
      const existingProduct = cart.products[existingProductIndex];

      let newProduct;

      if (existingProduct) {
        newProduct = { ...existingProduct };
        newProduct.quantity += 1;
        cart.products = [...cart.products];
        cart.products[existingProductIndex] = newProduct;
      } else {
        newProduct = { id: prodId, price: +prodPrice, quantity: 1 };
        cart.products = [...cart.products, newProduct];
      }

      cart.totalPrice += +prodPrice;

      fs.writeFile(filePath, JSON.stringify(cart), (err) => {
        console.log("Error writing to cart.json:", err);
      });
    });
  }

  static deleteProductFromCart(id) {
    fs.readFile(filePath, (err, fileContent) => {
      let cart = { products: [], totalPrice: 0 };

      if (!err) {
        try {
          cart = JSON.parse(fileContent);
        } catch (parseError) {
          console.log("Error parsing cart.json:", parseError);
          return; // Stop further execution if parsing fails
        }
      }

      const productToBeDeleted = cart.products.find((p) => p.id === id);

      if (!productToBeDeleted) {
        return; // Product not found in the cart, nothing to delete
      }
      // Adjust the total price
      cart.totalPrice -= productToBeDeleted.price * productToBeDeleted.quantity;
      // Update the products array by removing the product
      cart.products = cart.products.filter((p) => p.id !== id);

      fs.writeFile(filePath, JSON.stringify(cart), (err) => {
        if (err) {
          console.log("Error writing to cart.json:", err);
        } else {
          console.log(`Product with ID ${id} deleted from cart.`);
        }
      });
    });
  }

  static updateCartAfterEditing(id, newPrice) {
    fs.readFile(filePath, (err, fileContent) => {
      let cart = { products: [], totalPrice: 0 };

      if (!err) {
        try {
          cart = JSON.parse(fileContent);
        } catch (parseError) {
          console.log("Error parsing cart.json:", parseError);
          return;
        }
      }

      const updatedCart = { ...cart };

      const updatedProductIndex = updatedCart.products.findIndex(
        (p) => p.id === id
      );
      const updatedProduct = updatedCart.products.find((p) => p.id === id);

      if (!updatedProduct) {
        return; // Product not found in the cart, nothing to update
      }

      const oldPrice = +updatedProduct.price;

      updatedProduct.price = +newPrice;

      // Update the total price based on the price difference
      const priceDifference = newPrice - oldPrice;
      updatedCart.totalPrice += priceDifference * updatedProduct.quantity;
      // updatedCart.totalPrice += updatedProduct.price * updatedProduct.quantity;

      updatedCart.products[updatedProductIndex] = updatedProduct;

      fs.writeFile(filePath, JSON.stringify(updatedCart), (err) => {
        if (err) {
          console.log("Error updating cart:", err);
        } else {
          console.log(
            `Product with ID: ${id} is updated in the cart replacing the old price: ${oldPrice} with the new one: ${newPrice}.`
          );
        }
      });
    });
  }

  static fetchCartFromFile(cb) {
    fs.readFile(filePath, (err, fileContent) => {
      if (err) {
        console.log("Error reading cart.json:", err);
        return cb({ products: [], totalPrice: 0 });
      }

      let cart;
      try {
        cart = JSON.parse(fileContent);
      } catch (parseError) {
        console.log("Error parsing cart.json:", parseError);
        cart = { products: [], totalPrice: 0 };
      }

      cb(cart);
    });
  }
};
