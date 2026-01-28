const Listing = require("../models/listing");
const { listingSchema } = require("../schema.js");
const Booking = require("../models/booking.js");

module.exports.index = async (req, res) => {
  const allListings = await Listing.find({});
  res.render("listings/index.ejs", { allListings });
};

module.exports.renderNewForm = async (req, res) => {
  res.render("listings/new.ejs");
};

module.exports.showListing = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id)
    .populate({ path: "reviews", populate: { path: "author" } })
    .populate("owner");
  if (!listing) {
    req.flash("error", "Listing is not exist");
    return res.redirect("/listings");
  }

  // 🔒 CHECK ACTIVE BOOKINGS HERE
  const hasActiveBooking = await Booking.exists({
    listing: listing._id,
    checkOut: { $gte: new Date() }
  });

  res.render("listings/show.ejs", { listing, hasActiveBooking });
};

module.exports.createListing = async (req, res, next) => {
  let url = req.file.path;
  let filename = req.file.filename;
  let result = listingSchema.validate(req.body);
  if (result.error) {
    let errMeg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(400, errMeg);
  }
  const newListing = new Listing(req.body.listing);
  newListing.owner = req.user._id;
  newListing.image = { url, filename };

  await newListing.save();
  req.flash("success", "your new listing is done");
  res.redirect("/listings");
};

module.exports.renderEditForm = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  if (!listing) {
    req.flash("error", "Listing is not exist");
    return res.redirect("/listings");
  }

  let originalImageurl = listing.image.url;
  originalImageurl = originalImageurl.replace("/upload", "/upload/w_30 0");
  req.flash("success", "Data is Updated");
  res.render("listings/edit.ejs", { listing, originalImageurl });
};

module.exports.updateListing = async (req, res) => {
  let { id } = req.params;
  let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });
  if (typeof req.file !== "undefined") {
    let url = req.file.path;
    let filename = req.file.filename;
    listing.image = { url, filename };
    await listing.save();
  }
  req.flash("success", "your listing is updated");
  res.redirect(`/listings/${id}`);
};

module.exports.deleteListing = async (req, res) => {
  let { id } = req.params;

  // 🔍 Check if any FUTURE booking exists
  const activeBooking = await Booking.findOne({
    listing: id,
    checkOut: { $gte: new Date() }, // future or ongoing
  });

  if (activeBooking) {
    req.flash(
      "error",
      "This listing has active reservations and cannot be deleted.",
    );
    return res.redirect(`/listings/${id}`);
  }

  await Listing.findByIdAndDelete(id);

  req.flash("success", "Data is Deleted");

  res.redirect("/listings");
};
