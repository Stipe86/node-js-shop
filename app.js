const path = require("path");

const express = require("express");
const bodyParser = require("body-parser");
const expressHbs = require("express-handlebars");

const app = express();

// Setting up Handlebars as the default template engine and configuring it
app.engine(
  // Set "hbs" as the identifier for Handlebars templates

  "hbs",
  expressHbs({
    // Specify the directory for layouts (optional, this is the default path)
    layoutsDir: "views/layouts/",
    // Set the default layout file (in this case, main-layout.hbs)
    defaultLayout: "main-layout",
    // Tell Handlebars to use .hbs file extensions instead of the default .handlebars.
    // So to Use .hbs file extensions instead of the default .handlebars for all template files(Specifically, here ou're telling the engine that layout files  should use .hbs instead of .handlebars)
    extname: "hbs",
  })
);

// Set "hbs" as the default view engine
app.set("view engine", "hbs");
// Specify the views directory (where Handlebars will look for templates)
app.set("views", "views");

const adminData = require("./routes/admin");
const shopRoutes = require("./routes/shop");

app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.static(path.join(__dirname, "public")));

app.use("/admin", adminData.routes);

app.use(shopRoutes);

// app.use((req, res, next) => {
//   res.status(404).send("<h1>Page not found</h1>");
// });

// app.use((req, res, next) => {
//   res.status(404).sendFile(path.join(__dirname, "views", "404.html"));
// });

app.use((req, res, next) => {
  res.status(404).render("404", { pageTitle: "Page Not Found" });
});

app.listen(3000);
