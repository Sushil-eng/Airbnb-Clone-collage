const User = require("../models/user.js");

module.exports.renderSignupForm = (req, res) => {
  res.render("users/signup.ejs");
}

module.exports.signupForm = async (req, res) => {
    try {
      let { username, firstName, lastName, email, password } = req.body;
      const newUser = new User({ username, firstName, lastName, email });
      const registeredUser = await User.register(newUser, password);
      console.log(registeredUser);
       req.login( registeredUser, (err) => {
        if(err) {
            next(err);
        }
      req.flash("success", "welcome to Wonderlust");
      res.redirect("/listings");
      });
    } catch (error) {
      req.flash("error", "A user with given Usnername is already registered");
      res.redirect("/signup");
    }
  };

  module.exports.renderLoginForm  = (req, res) => {
    console.log("here login");
    res.render("users/login.ejs");
  };


  module.exports.login =  async (req, res) => {
    req.flash("success", "Welcome back to WanderLust!");
    let redirectUrl = res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);
  }
  
module.exports.logout = (req, res, next) => {
    req.logout((err) => {
        if(err) {
            next(err);
        }
        req.flash("success", "you are Logged out");
        res.redirect("/listings");
    })
}