const fs = require("fs").promises;

const path = require("path");

const rootDir = require("../util/path.js");

const filePath = path.join(rootDir, "data", "cart.json");

module.exports = class Cart {
  static async addToCart(prodId, price) {
    const prodPrice = parseFloat(price);
    let cart = { products: [], totalPrice: 0 };

    try {
      const fileContent = await fs.readFile(filePath, "utf-8");
      cart = JSON.parse(fileContent);
    } catch (err) {
      console.log("Error reading or parsing cart.json:", err);
    }

    const existingProductIndex = cart.products.findIndex(
      (p) => p.id === prodId
    );
    const existingProduct = cart.products[existingProductIndex];

    let newProduct = existingProduct
      ? {
          ...existingProduct,
          quantity: existingProduct.quantity + 1,
        }
      : { id: prodId, price: prodPrice, quantity: 1 };

    let updatedCartProducts = existingProduct
      ? [
          ...cart.products.slice(0, existingProductIndex),
          newProduct,
          ...cart.products.slice(existingProductIndex + 1),
        ]
      : [...cart.products, newProduct];

    cart.products = updatedCartProducts;

    cart.totalPrice += prodPrice;

    // let newProduct;
    // let temporaryCart = { ...cart };

    // if (existingProduct) {
    //   newProduct = { ...existingProduct };
    //   temporaryCart.products[existingProductIndex].quantity += 1;
    // } else {
    //   newProduct = { id: prodId, price: prodPrice, quantity: 1 };
    //   temporaryCart.products = [...cart.products, newProduct];
    // }

    // cart = { ...temporaryCart };

    // cart.totalPrice += prodPrice;

    try {
      await fs.writeFile(filePath, JSON.stringify(cart));
    } catch (err) {
      console.log("Error writing to cart.json:", err);
    }

    // fs.readFile(filePath, (err, fileContent) => {

    // let cart = { products: [], totalPrice: 0 };

    //   if (!err) {
    //     try {
    //       cart = JSON.parse(fileContent);
    //     } catch (parseError) {
    //       console.log("Error parsing cart.json:", parseError);
    //     }
    //   }

    //   const existingProductIndex = cart.products.findIndex(
    //     (p) => p.id === prodId
    //   );
    //   const existingProduct = cart.products[existingProductIndex];

    //   if (existingProduct) {
    //     existingProduct.quantity += 1;
    //   } else {
    //     cart.products.push({
    //       id: prodId,
    //       price: prodPrice,
    //       quantity: 1,
    //     });
    //   }

    //   cart.totalPrice += prodPrice;

    //   fs.writeFile(filePath, JSON.stringify(cart), (err) => {
    //     console.log("Error writing to cart.json:", err);
    //   });
    // });
  }
};
