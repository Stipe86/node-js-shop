const fs = require("fs");

const path = require("path");

const rootDir = require("../util/path.js");
const e = require("express");

// Define the path to the 'products.json' file where we'll store the products
const filePath = path.join(rootDir, "data", "products.json");

// Helper function to read the products from the 'products.json' file
// The callback (cb) will be used to return the products array asynchronously
const getProductsFromFile = (cb) => {
  // Read the 'products.json' file
  fs.readFile(filePath, (err, fileContent) => {
    // If there's an error (e.g., file doesn't exist), return an empty array via callback
    if (err) {
      cb([]);
    } else {
      // Otherwise try to parse the file content into a JavaScript array and return it, but if it's invalid, catch the error
      try {
        cb(JSON.parse(fileContent)); // Return the array of products via callback
      } catch (parseError) {
        // If parsing fails, return an empty array
        console.log(
          "Error parsing JSON data. Starting with an empty products array.",
          parseError
        );
        cb([]);
        // Note: Currently, because of this code, if there's an error parsing the JSON file (e.g., due to invalid JSON format),
        // the products array will be reset to an empty array. This means any existing products
        // will be lost if new products are added after a JSON parsing error.
        // To avoid data loss, proper validation or error handling may be added in future implementations.
      }
    }
  });
};

module.exports = class Product {
  constructor(id, title, imageUrl, price, description) {
    this.id = id;
    this.title = title;
    this.imageUrl = imageUrl;
    this.price = price;
    this.description = description;
  }

  // Save method to add a new product to the 'products.json' file
  save() {
    // Call the helper function to get the current products
    getProductsFromFile((products) => {
      if (this.id) {
        const existingProductIndex = products.findIndex(
          (p) => p.id === this.id
        );
        const updatedProducts = [...products];
        updatedProducts[existingProductIndex] = this;

        // Write the updated array back to the file as a JSON string
        fs.writeFile(
          filePath,
          JSON.stringify(updatedProducts, null, 2),
          (err) => {
            // Log if there was an error writing to the file
            console.log("Error writing to file", err);
          }
        );
      } else {
        // Generate a random ID for the product
        this.id = Math.random().toString();
        // Add the new product, (the current product instance (this)) to the array
        products.push(this);
        // Write the updated array back to the file as a JSON string
        fs.writeFile(filePath, JSON.stringify(products, null, 2), (err) => {
          // Log if there was an error writing to the file
          console.log("Error writing to file", err);
        });
      }
    });
  }

  static edit(id, title, imageUrl, price, description) {
    getProductsFromFile((products) => {
      const existingProductIndex = products.findIndex((p) => p.id === id);

      if (existingProductIndex === -1) {
        console.log(`Product with ID ${id} not found. Cannot edit.`);
        return;
      }

      const updatedProduct = {
        ...products[existingProductIndex],
        title,
        imageUrl,
        price,
        description,
      };

      products[existingProductIndex] = updatedProduct;

      fs.writeFile(filePath, JSON.stringify(products, null, 2), (err) => {
        console.log("Error writing to file", err);
      });
    });
  }

  static deleteProduct(id) {
    getProductsFromFile((products) => {
      const updatedProducts = products.filter((p) => p.id !== id);

      fs.writeFile(
        filePath,
        JSON.stringify(updatedProducts, null, 2),
        (err) => {
          if (!err) {
            console.log(`Product with ID ${id} deleted successfully.`);
          } else {
            console.error("Failed to delete product:", err);
          }
        }
      );
    });
  }

  // Static method to fetch all products from the file
  static fetchAll(cb) {
    getProductsFromFile(cb);
  }

  static findById(id, cb) {
    getProductsFromFile((products) => {
      const product = products.find((p) => p.id === id);
      cb(product);
    });
  }
};
