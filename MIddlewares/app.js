const express = require('express');
const app = express();
const ExpressError = require('./ExpressError.js');
// app.use((req, res, next) => {
//   // let {query} = req.query;
//   // console.log(query);
//  console.log("Hi, I am 1 middleware");
// //  res.send("middleware started");
//  next();
// })

// app.use((req, res, next) => {
//   console.log("Hii, i am 2 middleware");
//   next();
//   console.log("Sushil Maurya")
// })

const checkToken =  (req, res, next) => {
  let {token} = req.query;
  if(token === "giveaccess"){
    next();
  }
  // res.send("Access Denied");
  throw new ExpressError(401, "ACCESS DENIED");
}

app.get("/api", checkToken, (req, res) => {
  res.send("Access to Sushil")
})

app.get("/admin", (req, res) => {
  throw new ExpressError(403, "You are not Admin");
})


app.get("/err", (req, res) => {
  abcd=abcd;
});

app.use((err, req, res, next) => {
 let {status = 500, message = "Internal Server Error"} = err;
 res.status(status).send(message);
});

// app.use((err, req, res, next) => {
//   console.log("Error is coming from 2nd middleware");
//   next(err);
// })




app.use((req, res, next) => {
  req.date = new Date(Date.now()).toString();
  console.log(req.method, req.hostname, req.date);
  next();
})

app.use("/random", (req, res, next) => {
  console.log("I am only for Random");
  next();
})

app.get("/Sushil", (req, res) => {
 res.send("Middleware");
});

app.use((req, res) => {
  res.status(404).send("Page is not found");
})

app.get("/random/Sushil", (req, res) => {
  res.send("this is random page");
})

app.listen(8080, () => {
  console.log(`server is running on port ${8080}`);
})