const mongodb = require("mongodb");
const MongoClient = mongodb.MongoClient;

const mongoConnect = (callback) => {
  MongoClient.connect("mongodb://localhost:27017/node-js-shop")
    .then((client) => {
      console.log("Connected to MongoDB!");
      callback(client);
    })
    .catch((err) => {
      console.error("Connection failed!", err);
    });
};

module.exports = mongoConnect;
