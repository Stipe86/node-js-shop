const path = require("path");

const express = require("express");
const bodyParser = require("body-parser");

const errorController = require("./controllers/error");
const mongoConnect = require("./util/database").mongoConnect;
const User = require('./models/user');

const app = express();

app.set("view engine", "ejs");
app.set("views", "views");

const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

app.use((req, res, next) => {
  User.findById("6782d8b8a1030b371e6b21bd").then(user => {
    req.user = user;
    next();
  }).catch(err => {
    console.log(err);
  });
  // next();
});

app.use("/admin", adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);

// mongoConnect((client) => {
//   console.log("MongoDB Client:", client);
//   app.listen(3000, () => {
//     console.log("Server is running on http://localhost:3000");
//   });
// });

mongoConnect(() => {
  app.listen(3000, () => {
    console.log("Server is running on http://localhost:3000");
  });
});

// mongoConnect(() => {
//   app.listen(3000);
// });
