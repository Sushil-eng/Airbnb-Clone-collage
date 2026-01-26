const express = require("express");
const router = express.Router();
const Listing = require("../models/listing");
const wrapAsync = require("../utils/wrapAsync");


const { isLoggedIn, validateListing, isOwner } = require("../middleware.js");

const listingFavourite = require("../controllers/favourite.js");

router
  .route("/:listingId")
  .post(
    isLoggedIn,
    wrapAsync(listingFavourite.addFavourite)
  );

  
router
  .route("/show")
  .get(
    isLoggedIn,
    wrapAsync(listingFavourite.show)
  );

    
router
.delete(
    "/:listingId",
    isLoggedIn,
    wrapAsync(listingFavourite.removeFavourite)
  );

  module.exports = router;