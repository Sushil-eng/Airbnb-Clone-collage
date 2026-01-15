const Review = require("../models/review");
const Listing = require("../models/listing");

module.exports.createReview = async (req, res) => {
    console.log("data", req.params.id);
    // let listing = await Listing.findById(req.params.id);

    const { id } = req.params;

    const listing = await Listing.findById(id);

    let newRewiew = new Review(req.body.reviews);
    newRewiew.author = req.user._id;
    console.log(newRewiew);
    listing.reviews.push(newRewiew);

    await newRewiew.save();
    await listing.save();
  req.flash("success", "Review is posted");

    res.redirect(`/listings/${listing._id}`);
  };

  module.exports.destroyReview = async (req, res) => {
    console.log("i am connected review Delete");
    let { id, reviewId } = req.params;
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash("success", "Review is Deleted");
    res.redirect(`/listings/${id}`);
  };



