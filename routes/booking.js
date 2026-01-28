const express = require("express");
const router = express.Router();

const wrapAsync = require("../utils/wrapAsync");
const { isLoggedIn, validateListing } = require("../middleware.js");

const bookingController = require("../controllers/booking.js");


router
  .route("/:id/reserve")
  .post(
    isLoggedIn,
    wrapAsync(bookingController.createBooking)
  );

  router
  .route("/show")
  .get(
    isLoggedIn,
    wrapAsync(bookingController.showbookings)
  );

  router
  .route("/:id")
  .delete(isLoggedIn, wrapAsync(bookingController.deleteBooking));
  


   module.exports = router;