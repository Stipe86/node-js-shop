// Legacy import: Used for accessing the full MongoDB library, including ObjectId.
// Commented out in favor of a modern, more concise approach.
// const mongodb = require("mongodb");

// Modern and recommended import: Destructuring ObjectId directly from the MongoDB module.
// This is more concise and aligns with modern JavaScript practices.
const { ObjectId } = require("mongodb");
const getDb = require("../util/database.js").getDb;

const fs = require("fs");

const path = require("path");

const Cart = require("./cart");

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
  constructor(title, imageUrl, price, description, id, userId) {
    this.title = title;
    this.imageUrl = imageUrl;
    this.price = price;
    this.description = description;
    this._id = id ? new ObjectId(id) : null;
    this.userId = userId;
  }


  save() {
    const db = getDb();
    let dbOperation;

    if(this._id) {
      // Update the product if the _id already exists
      dbOperation = db.collection('products').updateOne({_id: this._id}, {$set: this});
    }
    else {
      dbOperation = db.collection("products").insertOne(this);
    }
    return dbOperation.then(result => {
      console.log(result);
    }).catch(err => {
      console.log(err);
    })

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
    const db = getDb();

        // Validate ObjectId format (optional but recommended)
        if (!ObjectId.isValid(id)) {
          throw new Error("Invalid ObjectId format");
        }

    return db.collection("products").deleteOne({_id: new ObjectId(id)}).then((result) => {
      if (result.deletedCount > 0) {
        console.log("Product deleted successfully.");
      } else {
        console.log("No product found with the given ID.");
      }
    })
    .catch((err) => {
      console.log(err);
    });
  }

  static fetchAll() {
    const db = getDb();
    return db
      .collection("products")
      .find()
      .toArray()
      .then((products) => {
        console.log(products);
        return products;
      })
      .catch((err) => {
        console.log(err);
      });
  }

  // This approach uses `mongodb.ObjectId` directly and the `.find()` method with `.next()`.
  // It is functional but uses a deprecated ObjectId constructor and is slightly verbose.

  // static findById(id) {
  //   const db = getDb();
  //   return db
  //     .collection("products") //  // Why `.find()` with `.next()`? The `.find()` returns a cursor, which is usually used for iterating over multiple documents. The `.next()` retrieves the next document from the cursor (the first document, in this case).
  //
  //     .find({ _id: new mongodb.ObjectId(`${id}`) }) // Why template literal (`${id}`)? It ensures the `id` is treated as a string, even if a number or other type is passed accidentally. Deprecated ObjectId constructor.
  //     .next()
  //     .then((product) => {
  //       console.log(product);
  //       return product;
  //     })
  //     .catch((err) => {
  //       console.log(err);
  //     });
  // }

  static findById(id) {
    const db = getDb();

    // Validate ObjectId format (optional but recommended)
    if (!ObjectId.isValid(id)) {
      throw new Error("Invalid ObjectId format");
    }

    return (
      db
        .collection("products")
        // Why `.findOne()` instead of `.find()`?
        // - `.findOne()` is specifically for retrieving a single document and does not require `.next()`.
        // - It's more concise and directly suited to this use case.
        .findOne({ _id: ObjectId.createFromHexString(id) }) // Use a modern non-deprecated method
        .then((product) => {
          console.log(product);
          return product;
        })
        .catch((err) => {
          console.log(err);
        })
    );
  }
};
