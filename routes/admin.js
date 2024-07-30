const express = require("express");

const router = express.Router();

// const bodyParser = require("body-parser");

// const app = express();

// router.use(bodyParser.urlencoded({ extended: false }));

router.get("/add-product", (req, res, next) => {
  res.send(
    "<form action='/product' method='POST'><input type='text' name='title'><button type='submit'>Add product</button></form>"
  );
  res.redirect("/product");
});

router.post("/product", (req, res, next) => {
  console.log(req.body);
  res.redirect("/");
});

module.exports = router;
