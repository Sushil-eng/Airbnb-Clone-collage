const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");

const userController = require("../controllers/user.js");

const { isLoggedIn, validateListing, isOwner } = require("../middleware.js");
const multer = require('multer');
const { storage } = require("../cloudConfig.js");
const upload = multer({ storage });

router
  .route("/signup")
  .get(userController.renderSignupForm)
  .post(
  upload.single('avatar'),
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

router.get("/", userController.frontPage);

router
  .route("/update")
  .put(isLoggedIn, upload.single('avatar'), userController.updateProfileForm)



module.exports = router;
