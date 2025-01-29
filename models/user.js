const { ObjectId } = require("mongodb");
const getDb = require("../util/database.js").getDb;

class User {
  constructor(username, email, cart, id) {
    this.name = username;
    this.email = email;
    this.cart = cart; // {items: []}
    this._id = id;
  }

  save() {
    const db = getDb();
    return db.collection("users").insertOne(this);
  }

  addToCart(product) {
    // This would check if the product already exists in the cart (not used currently)
    // const cartProduct = this.cart.items.findIndex(cp => {return cp._id === product._id});

    // First approach: Store the full product object directly in the cart and manually add a quantity field.
    // This approach stores the entire product object in the database, which may lead to duplicated data.
    // product.quantity = 1;
    // const updatedCart = { items: [product] };

    // Second approach: Use an object inside of items and the spread operator to copy all product properties and add quantity
    // const updatedCart = { items: [{ ...product, quantity: 1 }] };

    // Third approach (currently used) - store only a reference (product ID) instead of the full product data.
    // This avoids redundant data storage while still tracking quantity.
    const updatedCart = {
      items: [{ productId: new ObjectId(product._id), quantity: 1 }],
    };

    const db = getDb();

    return db
      .collection("users")
      .updateOne(
        { _id: new ObjectId(this._id) },
        { $set: { cart: updatedCart } }
      );
  }

  static findById(userId) {
    const db = getDb();
    return db.collection("users").findOne({ _id: new ObjectId(userId) });
  }
}

module.exports = User;
