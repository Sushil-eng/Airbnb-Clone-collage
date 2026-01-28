const mongoose = require("mongoose");
const Schema = mongoose.Schema;


const bookingSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  listing: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Listing",
    required: true
  },
  checkIn: Date,
  checkOut: Date,
  totalPrice: Number,
  
});

module.exports = mongoose.model("Booking", bookingSchema);
