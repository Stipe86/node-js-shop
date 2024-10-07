const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");

const app = express();

// This line tells Express to use Pug as the templating engine. When you render views in your application, Express will use Pug to generate the HTML
app.set("view engine", "pug");
// This line specifies the directory where your view files (Pug templates) are located. By default, Express looks for the views directory in the root of your project, so if your views are in a directory named "views" at the root level, this line is technically redundant. However, it can be useful for clarity or if you ever change the location of your views
app.set("views", "views");

const adminData = require("./routes/admin");
const shopRoutes = require("./routes/shop");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

app.use("/admin", adminData.routes);
app.use(shopRoutes);

// Old route handler using static HTML file (before Pug integration). This code was used to serve `404.html` directly from the views folder:
// app.use((req, res, next) => {
//   res.status(404).sendFile(path.join(__dirname, "views", "404.html"));
// });

// This setup uses Pug as the templating engine to render the `404.pug` file. Since we set Pug as the default view engine and the `views` folder as the default location, we don’t need to specify the file extension (shop.pug) or the full path to the template (to that folder). Express will automatically look for `404.pug` in the `views` directory and use it to generate the HTML response
app.use((req, res, next) => {
  res.status(404).render("404");
});

app.listen(3000);
