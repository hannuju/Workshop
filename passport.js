const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const db = require("./database");
const bcrypt = require("./bcrypt");

module.exports = (passport) => {
  // Serialize
  passport.serializeUser((user, done) => {
    done(null, user);
  });
  //Deserialize
  passport.deserializeUser((id, done) => {
    db.searchUserByID(id, (result) => {
      done(null, result);
    });
  });
}

passport.use(new LocalStrategy((username, password, done) => {
  // Check if username exists in database, return user if true
  db.searchUserByName(username, (res) => {
    if (res[0] == null) {
      console.log("No user found by that name!");
      return done(null, false);
    }
    // Check if given password matches with users
    hash =  res[0].password;
    bcrypt.compare(password, hash, (result) => {
      if (result == false) {
        console.log("Password didn't match!")
        return done(null, false);
      }
      console.log("Successful login");
      return done(null, res);
    });
  });
}));
