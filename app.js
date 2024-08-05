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

app.use((req, res, next) => {
  res.status(404).sendFile(path.join(__dirname, "views", "404.html"));
});

app.listen(3000);
