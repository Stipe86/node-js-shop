const mongodb = require("mongodb");
const MongoClient = mongodb.MongoClient;

let _db;

const mongoConnect = (callback) => {
  MongoClient.connect("mongodb://localhost:27017/node-js-shop")
    .then((client) => {
      _db = client.db();
      console.log("Connected to MongoDB!");
      callback(client);
    })
    .catch((err) => {
      console.error("Connection failed!", err);
      throw err;
    });
};

const getDb = () => {
  if (_db) {
    return _db;
  }
  throw "No database found!";
};

exports.mongoConnect = mongoConnect;

exports.getDb = getDb;
