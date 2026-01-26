if(process.env.NODE_ENV !== "production"){
  require('dotenv').config();
}

console.log(process.env.SECRET);

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const session = require("express-session");
const MongoStore = require("connect-mongo").default;
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");



const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/reviews.js");
const userRouter = require("./routes/user.js");
const favouriteRouter  = require("./routes/favourite.js");

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(methodOverride("_method"));
app.use(express.urlencoded({extended: true}));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "/public")));

// const dbUrl = process.env.ATLASDB_URI;
const dbUrl =
  process.env.NODE_ENV === "production"
    ? process.env.MONGO_URI_PROD
    : process.env.MONGO_URI_LOCAL;

console.log("DB URL being used:", dbUrl); // temporary debug

main()
.then(() => {
  console.log("connection is successful");
}).catch((err) => {
  console.log("Some error in Database");
})

async function main() {
  await mongoose.connect(dbUrl);
}

console.log("mongostore",MongoStore);
const store = MongoStore.create({
  mongoUrl: dbUrl,
  crypto: {
    secret: process.env.SECRET,
  },
  touchAfter: 24 * 60 * 60,
});

store.on("error", () => {
  console.log("Session Store Error");
});

const sessionOption = {
  store,
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
    maxAge:  7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
  },
};


app.use(session(sessionOption));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currUser = req.user;
  next();
})




// app.get("/demouser", async(req, res) => {
//   let fakeUser = new User({
//     email: "student@gmail.com",
//     username: "delta-student"
//   });

//   let registeredUser = await User.register(fakeUser, "helloworld");
//   res.send(registeredUser);
// });

app.use("/listings", listingRouter);
app.use("/listings/:id/reviews", reviewRouter);
app.use("/", userRouter);
app.use("/favourite", favouriteRouter);



// app.get("/testListing", async (req, res) => {
//   let samplelisting = new Listing({
//     title: "My new beach",
//     description: "By the Beach",
//     price: 1200,
//     location: "Calangute, Goa",
//     country: "India",
//   });
//   await samplelisting.save();
//   res.send("Successful testing has been done");
//   console.log("Sample was save");
// })

app.all(/.*/, (req, res, next) => {
  next(new ExpressError(404, "page Not Found"));
})

app.use((err, req, res, next) => {
  let {statusCode=505, message="Something Want Wrong"} = err;
  res.status(statusCode).render("error.ejs", {err});
  // res.status(statusCode).send(message);
})

let port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log(`Server is Running port ${port}`);
})