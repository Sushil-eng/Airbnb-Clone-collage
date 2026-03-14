const express = require("express");
const router = express.Router();

const wrapAsync = require("../utils/wrapAsync");


const { isLoggedIn, validateListing, isOwner } = require("../middleware.js");

const listingFavourite = require("../controllers/favourite.js");

// /show MUST come before /:listingId, otherwise Express matches "show" as a listingId
router
  .route("/show")
  .get(
    isLoggedIn,
    wrapAsync(listingFavourite.show)
  );

router
  .route("/:listingId")
  .post(isLoggedIn, wrapAsync(listingFavourite.addFavourite))
  .delete(isLoggedIn, wrapAsync(listingFavourite.removeFavourite));

  module.exports = router;