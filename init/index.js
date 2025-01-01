const mongoose=require('mongoose');
const initData=require("./data.js");
const Listings=require("../models/listing.js");

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');
};

main()
.then(()=>{console.log("connected to db")})
.catch(err => console.log(err));

const initDB=async ()=>{
    await Listings.deleteMany({});
    await Listings.insertMany(initData.data);
    console.log("db was initialised");
}

initDB();