const mongoose = require("mongoose");
const initData = require("./data");
const Listing = require("../models/listing.js");


main()
.then(() => {
  console.log("connection is successful");
}).catch((err) => {
  console.log("Some error in Database");
})

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');
};


const initDB = async () =>{
  await Listing.deleteMany({});
  await Listing.insertMany(initData.data);
  console.log("Data is Inserted Successfully Thanks For insereting @")
} 

initDB();