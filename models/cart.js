const fs = require("fs");

const path = require("path");

const rootDir = require("../util/path.js");

const filePath = path.join(rootDir, "data", "cart.json");

module.exports = class Cart {
  static addToCart(prodId, price) {
    const prodPrice = parseFloat(price);
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

      if (existingProduct) {
        existingProduct.quantity += 1;
      } else {
        cart.products.push({
          id: prodId,
          price: prodPrice,
          quantity: 1,
        });
      }

      cart.totalPrice += prodPrice;

      fs.writeFile(filePath, JSON.stringify(cart), (err) => {
        console.log("Error writing to cart.json:", err);
      });
    });
  }
};
