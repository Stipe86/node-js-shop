const path = require("path");

const express = require("express");
const bodyParser = require("body-parser");

const errorController = require("./controllers/error");
const sequelize = require("./util/database");
const Product = require("./models/product");
const User = require("./models/user");
const Cart = require("./models/cart");
const CartItem = require("./models/cart-item");

const app = express();

app.set("view engine", "ejs");
app.set("views", "views");

const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

// Middleware to fetch the dummy user from the database and attach it to req.user.
// Adds a new property (req.user) to the req object to make the user available in all routes.
// Ensures the property name (req.user) does not override existing properties like req.body.
// By doing this, we avoid repetitive database queries in every route handler.
app.use((req, res, next) => {
  User.findByPk(1)
    .then((user) => {
      req.user = user;
      next();
    })
    .catch((err) => console.log(err));
});

app.use("/admin", adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);

Product.belongsTo(User, { constrains: true, onDelete: "CASCADE" });
User.hasMany(Product);
User.hasOne(Cart);
Cart.belongsTo(User);
Cart.belongsToMany(Product, { through: CartItem });
Product.belongsToMany(Cart, { through: CartItem });

sequelize
  // .sync({ force: true })
  .sync()
  .then((result) => {
    return User.findByPk(1);
    // console.log(result);
  })
  .then((user) => {
    if (!user) {
      return User.create({ name: "Steve", email: "steve@something.com" });
    }
    // return Promise.resolve(user);
    // Using Promise.resolve(user) here explicitly ensures a consistent return type
    // (a Promise) across both branches of this if-else statement.
    // However, in this specific case, returning just `user` directly is safe because:
    // - Sequelize's User.create() already returns a Promise.
    // - User.findByPk() also returns a Promise resolving to a Sequelize user object.
    // Therefore, `return user;` can be used instead, as both branches are guaranteed
    // to return the same type (a Sequelize user object).
    // Uncomment the `return Promise.resolve(user);` line if you want to be explicit
    return user;
  })
  // .then((user) => {
  //   return user.createCart();
  // })
  .then((user) => {
    return user.getCart().then((cart) => {
      if (!cart) {
        return user.createCart(); // Create cart only if none exists
      }
      return cart; // Cart already exists, return it
    });
  })
  .then((cart) => {
    app.listen(3000);
  })
  .catch((err) => {
    console.log(err);
  });
