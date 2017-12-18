const express = require("express");
const router = express.Router();
const db = require("../database");
const Cart = require("../cart")
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("../bcrypt");
var validator = require('validator');

// Render homepage with all items
router.get("/", (req, res) => {
  db.searchAll((result) => {
    req.session.view = "/";
    res.render("home", {result, user: req.session.user, cart: req.session.cart, highlight: "all"});
  });
});

// Reddirect to last view
router.get("/homepage", (req, res) => {
    res.redirect(req.session.view);
});

// *************************** User actions ******************************

// Login and save user to session
router.post("/login", passport.authenticate("local", {failureRedirect: "/"}), (req, res) => {
  user = req.user[0];
  req.session.user = user;
  console.log(user.username + " logged in!");
  res.redirect("/homepage");
});

// Logout and clear session
router.get("/logout", (req, res) => {
  req.session.user = null;
  req.logout();
  console.log("Logged ouT!")
  res.redirect("/homepage");
});

// Register user, if role OR credit is not assigned default values are used
router.post("/register", (req, res) => {
  creditStr = req.body.credit.toString();
  if ((validator.isEmpty(creditStr)) || (!validator.isNumeric(creditStr)) || (validator.isEmpty(req.body.username)) || (validator.isEmpty(req.body.password))) {
    console.log("Inputs empty or false")
    res.redirect("/homepage");
  }
  else {
    // Check if username is already in use
    db.searchUserByName(req.body.username, (respond) => {
      if (respond[0] != null) {
        console.log("Username is already in use! User not created");
        res.redirect("/homepage");
      }
      else {
        bcrypt.hash(req.body.password, (hash) => {
          let user = {username: req.body.username, password: hash, role: "customer", credit: 1000};
          if (req.body.role) {
            user.role = req.body.role;
          } if (req.body.credit) {
            user.credit = req.body.credit;
          } db.createUser(user, (result) => {
            console.log("New user created!")
            res.redirect("/homepage");
          });
        });
      }
    });
  }
});

// Edit users credit amount
router.post("/edit-credits", (req, res) => {
  creditStr = req.body.amount.toString();
  if ((validator.isEmpty(creditStr)) || (!validator.isNumeric(creditStr)) || (validator.isEmpty(req.body.username))) {
    console.log("Inputs empty or false")
    res.redirect("/homepage");
  } else {
    db.editCredits(req.body.username, req.body.amount, (result) => {
      // If admin editing credits for himself, update sessions also
      if (req.body.username == req.session.user.username) {
        req.session.user.credit += +(req.body.amount);
      }
      console.log("Credit amount edited!")
      res.redirect("/homepage");
    });
  }
});

// Delete user
router.post("/deleteuser", (req, res) => {
  if (validator.isEmpty(req.body.username)) {
    console.log("Input empty!")
    res.redirect("/homepage");
  } else {
    db.deleteUser(req.body.username, (result) => {
      console.log("User deleted!");
      res.redirect("/homepage");
    });
  }
});

// ***************************** Item actions *********************************

// Render homepage with searched item
router.post("/search", (req, res) => {
  let keyword = req.body.keyword;
  if (validator.isEmpty(keyword)) {
    console.log("Empty!");
  }
  console.log("Searching" + keyword);
  req.session.view = "/";
  db.search(keyword, (result) => {
    res.render("home", {result, user: req.session.user, cart: req.session.cart});
  });
});

// Render homepage with items from category Tools
router.get("/tools", (req, res) => {
  console.log("Filtering view");
  req.session.view = "/tools";
  db.searchAllTools((result) => {
    res.render("home", {result, user: req.session.user, cart: req.session.cart, highlight: "tools"});
  });
});

// Render homepage with items from category Miscellaneous
router.get("/miscellaneous", (req, res) => {
  console.log("Filtering view");
  req.session.view = "/miscellaneous";
  db.searchAllMiscellaneous((result) => {
    res.render("home", {result, user: req.session.user, cart: req.session.cart, highlight: "misc"});
  });
});

// Add item to database
router.post("/additem", (req, res) => {
  stock = req.body.stock.toString();
  price = req.body.price.toString();
  if ((validator.isEmpty(stock)) || (validator.isEmpty(price)) || (!validator.isNumeric(stock)) || (!validator.isNumeric(price))) {
    console.log("Inputs empty or not numeric!")
    res.redirect("/homepage");
  } else {
    let item = {title: req.body.title, category: req.body.category, description: req.body.description, price: req.body.price, stock: req.body.stock};
    db.addItem(item, (result) => {
      console.log("New item added!");
      res.redirect("/homepage");
    });
  }
});

// Edit stock amount
router.post("/edit-stock", (req, res) => {
  let id = req.body.id;
  let stock = req.body.stock;
  stockStr = stock.toString();
  idStr = id.toString();
  if ((validator.isEmpty(stockStr)) || (validator.isEmpty(idStr)) || (!validator.isNumeric(stockStr)) || (!validator.isNumeric(idStr))) {
    console.log("Inputs empty or not numeric!")
    res.redirect("/homepage");
  } else {
    db.editStock(id, stock, (result) => {
      console.log("Stock amount edited!")
      res.redirect("/homepage");
    });
  }
});

// Delete item
router.post("/deleteitem", (req, res) => {
  let id = req.body.id;
  idStr = id.toString();
  if ((validator.isEmpty(idStr)) || (!validator.isNumeric(idStr))) {
    console.log("Inputs empty or not numeric!")
    res.redirect("/homepage");
  } else {
    db.deleteItem(id, (result) => {
      console.log("Item deleted!")
      res.redirect("/homepage");
    });
  }
});

// Cart view
router.get("/cart", (req, res) => {
  console.log("Cart view rendered!")
  res.render("cart", {cart: req.session.cart, user: req.session.user});
});

// Add item to cart
router.get("/add-to-cart/:id", (req, res, next) => {
  let id = req.params.id;
  let cart = new Cart(req.session.cart ? req.session.cart : {} );
  db.addToCart(id, (result) => {
    cart.add(result, id);
    req.session.cart = cart;
    console.log("item added to cart!")
    res.redirect("/homepage");
  });
});

// Empty cart by creating new one
router.get("/empty-cart", (req, res) => {
  console.log("Cart emptied!")
  let cart = new Cart({});
  req.session.cart = cart;
  res.redirect("/cart");
});

// Purchasing cart items
router.get("/buy", (req, res) => {
  // Check if user is logged in
  if (!req.session.user) {
    console.log("You are not logged in boy!");
    res.redirect("/cart");
  }
  else {
    cart = req.session.cart;
    user = req.session.user;
    // Check if user has enough money
    if (user.credit < cart.totalPrice) {
      console.log("Too little money! No transactions made boy");
      res.redirect("/cart");
    }
    else {
       // Loop through items and reduce stock quantity
      items = cart.items;
      for (var id in items) {
        if (items.hasOwnProperty(id)) {
          let qty = -(cart.items[id].qty);
          db.editStock(id, qty, (result) => {
          });
        }
      }
      // Edit users credit amount to database AND session, and empty cart
      let price = -(cart.totalPrice);
      db.editCredits(user.username, price, (result) => {
        req.session.user.credit += (price);
        cart = new Cart({});
        req.session.cart = cart;
        console.log("items purchased!")
        res.redirect("/homepage");
      });
    }
  }
});

// ******************** Predefined stuff ********************************

// Create database "store"
router.get("/createdb", (req, res) => {
  db.createDatabase((result) => {
    res.send("Database created");
  });
});

// Create table "items" and populate
router.get("/createtableitems", (req, res) => {
  db.createTableItems((res1) => {
    db.populateItems((res2) => {
      res.send("Table items created and populated!");
    });
  });
});

// Create table "users" and populate
router.get("/createtableusers", (req, res) => {
  db.createTableUsers((result) => {
    db.addAdmin((res1) => {
      db.addEmployee((res2) => {
        db.addCustomer((res3) => {
          res.send("Table users created and populated!");
        });
      });
    });
  });
});

module.exports = router;
