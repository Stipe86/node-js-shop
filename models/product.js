const fs = require("fs");

const path = require("path");

const rootDir = require("../util/path.js");

// Define the path to the 'products.json' file where we'll store the products
const filePath = path.join(rootDir, "data", "products.json");

module.exports = class Product {
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
        try {
          // Try to parse the file content into a JavaScript array, but if it's invalid, catch the error
          products = JSON.parse(fileContent);
        } catch (parseError) {
          console.log(
            "Error parsing JSON data. Starting with an empty products array.",
            parseError
          );
        }
      }

      // Add the new product, (the current product instance (this)) to the array
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
  static fetchAll(cb) {
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
          console.log("Error parsing JSON", parseError);
          cb([]);
        }
      }
    });
  }
};
