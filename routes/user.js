const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");

const userController = require("../controllers/user.js");
const user = require("../models/user.js");

const { isLoggedIn, validateListing, isOwner } = require("../middleware.js");

router
  .route("/signup")
  .get(userController.renderSignupForm)
  .post(
  wrapAsync(userController.signupForm)
);

router
  .route("/login")
  .get(userController.renderLoginForm)
  .post(
  saveRedirectUrl,
  passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true,
  }), userController.login
);

router
  .route("/show")
  .get(isLoggedIn, userController.showProfileForm)

router
  .route("/edit")
  .get(isLoggedIn, userController.editProfileForm)

router.get("/logout", userController.logout);


router
  .route("/update")
  .put(isLoggedIn, userController.updateProfileForm)


module.exports = router;
