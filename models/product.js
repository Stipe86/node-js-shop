const products = [];

// My first way
// const Product = class {
//   constructor(t) {
//     this.title = t;
//   }

//   save() {
//     products.push(this);
//   }

// static fetchAll() {
//   return products;
// }
// };

// module.exports = Product;

// It can also be written this way
// module.exports = function Product() {
// ...
// };

module.exports = class Product {
  constructor(t) {
    this.title = t;
  }

  save() {
    products.push(this);
  }

  static fetchAll() {
    return products;
  }
};
