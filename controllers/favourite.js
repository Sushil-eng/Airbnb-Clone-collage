const User = require("../models/user.js");

module.exports.addFavourite = (async (req, res) => {
    console.log("Adding to favourites");
    const { listingId } = req.params;
    const id = req.user._id
    let user = await User.findById(id);

  if (!user.favourites.includes(listingId)) {
    user.favourites.push(listingId);
    await user.save();
  }

  req.flash("success", "Listing is added to favourites");
  res.redirect(`/listings/${id}`);
});

module.exports.show = (async (req, res) => {
    const id = req.user._id;
    const user = await User.findById(id).populate("favourites");
    res.render("listings/favourite.ejs", { user });
})

module.exports.removeFavourite = async (req, res) => {
  const { listingId } = req.params;
  const userId = req.user._id;
  
  await User.findByIdAndUpdate(userId, {
    $pull: { favourites: listingId }
  });
    req.flash("success", "Listing is removed from favourites");
   return res.redirect("/favourite/show");
};