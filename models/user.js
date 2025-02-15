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
    // This checks if the product already exists in the cart
    const cartProductIndex = this.cart.items.findIndex((cpi) => {
      return cpi.productId.toString() === product._id.toString();
    });

    let newQuantity = 1;

    const updatedCartItems = [...this.cart.items];

    if (cartProductIndex >= 0) {
      newQuantity = this.cart.items[cartProductIndex].quantity + 1;
      updatedCartItems[cartProductIndex].quantity = newQuantity;
    } else {
      updatedCartItems.push({
        productId: product._id,
        quantity: newQuantity,
      });
    }

    // First approach: Store the full product object directly in the cart and manually add a quantity field.
    // This approach stores the entire product object in the database, which may lead to duplicated data.
    // product.quantity = 1;
    // const updatedCart = { items: [product] };

    // Second approach: Use an object inside of items and the spread operator to copy all product properties and add quantity
    // const updatedCart = { items: [{ ...product, quantity: 1 }] };

    // Third approach (currently used) - store only a reference (product ID) instead of the full product data.
    // This avoids redundant data storage while still tracking quantity.

    // const updatedCart = {
    //   items: [{ productId: product._id, newQuantity }],
    // };

    const updatedCart = {
      items: updatedCartItems,
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
