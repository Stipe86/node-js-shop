const fs = require("fs");

const path = require("path");

const rootDir = require("../util/path.js");

// Define the path to the 'products.json' file where we'll store the products
const filePath = path.join(rootDir, "data", "products.json");

const Product = class {
  constructor(t) {
    this.title = t;
  }

  // Save a product by writing it to the 'products.json' file
  save() {
    // Read the current contents of the 'products.json' file
    fs.readFile(filePath, (err, fileContent) => {
      let products = [];
      // If the file exists and has data, parse it into an array

      if (err) {
        // If there is an error, we assume the file doesn't exist yet
        // Start with an empty array of products
        products = [];
      } else {
        // No error, successfully read the file
        // Parse the file contents into a JavaScript array
        products = JSON.parse(fileContent);
      }

      // Add the new product to the array
      products.push(this);

      // Write the updated array back to the file
      fs.writeFile(filePath, JSON.stringify(products), (err) => {
        // Log if there was an error writing to the file
        if (err) {
          console.log("Error writing to file", err);
        }
      });
    });
  }

  // Static method to fetch all products
  static fetchAll() {
    // Read the 'products.json' file
    fs.readFile(filePath, (err, fileContent) => {
      // If there's an error (e.g., file doesn't exist), return an empty array
      if (err) {
        return [];
      } else {
        // Otherwise parse the JSON content into an array and return it
        return JSON.parse(fileContent); // Return the array of products
      }
    });
  }
};

module.exports = Product;
