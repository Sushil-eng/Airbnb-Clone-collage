const Booking = require("../models/booking.js");
const Listing = require("../models/listing.js");

module.exports.createBooking = async (req, res) => {
  const { checkIn, checkOut } = req.body;
  const listingId = req.params.id;
  const userId = req.user._id;

  if (new Date(checkIn) >= new Date(checkOut)) {
    req.flash("error", "Invalid date selection");
    return res.redirect(`/listings/${listingId}`);
  }

  const listing = await Listing.findById(listingId);

  // 💰 Price calculation
  const nights =
    (new Date(checkOut) - new Date(checkIn)) / (1000 * 60 * 60 * 24);

  const totalPrice = nights * listing.price;

  // ❌ Prevent double booking
  const conflict = await Booking.findOne({
    listing: listingId,
    $or: [
      { checkIn: { $lt: checkOut }, checkOut: { $gt: checkIn } }
    ]
  });

  if (conflict) {
    req.flash("error", "Dates already booked");
    return res.redirect(`/listings/${listingId}`);
  }

  await Booking.create({
    user: userId,
    listing: listingId,
    checkIn,
    checkOut,
    totalPrice
  });

  req.flash("success", "Room reserved successfully 🎉");
  res.redirect(`/listings/${listingId}`);
};

module.exports.showbookings = async (req, res) => {
    
    const userId = req.user._id;
    let bookings = await Booking.find({ user: userId}).populate("listing");
   
    res.render("booking/show.ejs", { bookings });
}

module.exports.deleteBooking = async (req, res) => {
    console.log("Cancelling booking");
    const { id } = req.params;
    const userId  = req.user._id;
    const booking = await Booking.findById(id);
    if (!booking) {
        req.flash("error", "Booking not found");
        return res.redirect("/booking/show");
    }

    if (!booking.user.equals(userId)) {
    req.flash("error", "You are not allowed to cancel this booking");
    return res.redirect("/booking/show");
  }

  if(booking.checkIn <= new Date() ) {
    req.flash("error", "Cannot cancel past or ongoing bookings");
    return res.redirect("/booking/show");
  }

  await Booking.findByIdAndDelete(id);
  res.redirect("/booking/show");
}
