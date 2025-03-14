const mongoose = require("mongoose");
const initData = require("./data.js");
const Listings = require("../models/listing.js");
require("dotenv").config();
const url = process.env.ATLASDB_URL;
const localMongoUrl = "mongodb://127.0.0.1:27017/wanderlust";
async function main() {
  await mongoose.connect(url);
}

main()
  .then(() => {
    console.log("connected to db");
  })
  .catch((err) => console.log(err));

const initDB = async () => {
  await Listings.deleteMany({});
  initData.data = initData.data.map((obj) => ({
    ...obj,
    owner: "67aa325f8e840506c3f78699",
  }));
  await Listings.insertMany(initData.data);
  console.log("db was initialised");
};

initDB();
