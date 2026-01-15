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
  initData.data = initData.data.map((obj) => ({...obj, owner: "693e9d277ef2f27e04b80716"}));
  await Listing.insertMany(initData.data);
  console.log("Data is Inserted Successfully Thanks For insereting @")
} 

initDB();