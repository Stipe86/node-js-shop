const path = require("path");

const express = require("express");
const bodyParser = require("body-parser");

const errorController = require("./controllers/error");

const app = express();

// This line tells Express to use EJS as the templating engine. When you render views in your application, Express will use EJS to generate the HTML
app.set("view engine", "ejs");
// This line specifies the directory where your view files (EJS templates) are located. By default, Express looks for the views directory in the root of your project, so if your views are in a directory named "views" at the root level, this line is technically redundant. However, it can be useful for clarity or if you ever change the location of your views
app.set("views", "views");

const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");

app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.static(path.join(__dirname, "public")));

app.use("/admin", adminRoutes);
app.use(shopRoutes);

// app.use((req, res, next) => {
//   res.status(404).send("<h1>Page not found</h1>");
// });

// Old route handler using static HTML file (before EJS integration). This code was used to serve `404.html` directly from the views folder:
// app.use((req, res, next) => {
//   res.status(404).sendFile(path.join(__dirname, "views", "404.html"));
// });

// This setup uses EJS as the templating engine to render the `404.ejs` file. Since we set EJS as the default view engine and the `views` folder as the default location, we don’t need to specify the file extension (404.ejs) or the full path to the template (to that folder). Express will automatically look for `404.ejs` in the `views` directory and use it to generate the HTML response
// app.use((req, res, next) => {
//   res.status(404).render("404", { pageTitle: "Page Not Found", path: "" });
// });

app.use(errorController.get404);

app.listen(3000);
