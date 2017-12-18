const express = require("express");
const exphbs = require("express-handlebars");
const bodyParser = require("body-parser");
const session = require("express-session");
const port = 3000;
const passport = require("passport");
const index = require("./routes/index");
const app = express();

var hbs = exphbs.create({
    helpers: {
      equal: function(lvalue, rvalue, options) {
          if (arguments.length < 3)
              throw new Error("Handlebars Helper equal needs 2 parameters");
          if( lvalue!=rvalue ) {
              return options.inverse(this);
          } else {
              return options.fn(this);
          }
      }
    },
    defaultLayout: "main"
});

app.engine("handlebars", hbs.engine);
app.set("view engine", "handlebars");

app.use(express.static(__dirname + "/views"));
app.use(bodyParser.urlencoded({ extended: false }));

app.use(session({
  secret: "superman",
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }
}));

app.use(passport.initialize());
app.use(passport.session());
require("./passport")(passport);

app.use("/", index);

app.listen(port, "0.0.0.0", (err) => {
  if (err) throw err;
  console.log("Server is listening");
});
