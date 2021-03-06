const express = require("express");
const app = express();
const MongoClient = require('mongodb').MongoClient;
const Mongoose = require("mongoose");
const bodyParser = require("body-parser");
const User = require("./models/User.js");
const Log = require("./models/Log.js");
const UComponent = require("./components/user.js");
const flash = require('connect-flash');
const methodOverride = require('method-override');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const ExpressSession = require('express-session');
const passportLocalMongoose = require("passport-local-mongoose");
const indexRoutes = require("./routes/index.js");
const logRoutes = require("./routes/logs.js");
const userRoutes = require('./routes/user.js');
const updateUsers = require('./updateUsers.js');
const port = process.env.PORT || 8080;

Mongoose.connect("mongodb://localhost/users");
app.use(express.static(__dirname + "/public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(ExpressSession({
    secret: "User Authentication",
    resave: false,
    saveUninitialized: false }));
app.use(passport.initialize());
app.use(passport.session());
app.use(methodOverride("_method"));
// app.use(flash());
app.set("view engine", "ejs");
/* ---------------- Passport Config ------------------*/

// for when i found a better name for non-admin users
// updateUsers();

app.use("/", indexRoutes);
app.use("/log", logRoutes);
app.use("/user", userRoutes);

// passport.use(new LocalStrategy(
//   function(username, password, done) {
//     User.findOne({ username: username }, function(err, user) {
//       if (err) { return done(err); }
//       if (!user) {
//         return done(null, false, { message: 'Incorrect username.' });
//       }
//       if (!user.validPassword(password)) {
//         return done(null, false, { message: 'Incorrect password.' });
//       }
//       return done(null, user);
//     });
//   }
// ));

passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use((req,res,next)=>{
    res.locals.currentUser = req.user;
    // res.locals.error = req.flash("error");
    // res.local.success = req.flash("success");
    next();
});


app.listen(process.env.PORT, process.env.IP, () => {
  console.log("Service is running");
});
