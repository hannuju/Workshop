const mysql = require("mysql");
const bcrypt = require("./bcrypt");

// Create pool and establish connection
var pool = mysql.createPool({
  host: "localhost", //process.env.MYSQL_HOST,
  user: "root", //process.env.MYSQL_USER,
  password: "rooot", //process.env.MYSQL_PASS,
  database: "store", //process.env.MYSQL_DB,
  connectionLimit: 10,
  supportBigNumbers: true
});

// Create new user
exports.createUser = (user, res) => {
  let sql = "INSERT INTO users SET ?";
  pool.getConnection((error, connection) => {
    if(error) throw error;
    connection.query(sql, user, (err, result) => {
      connection.release();
      if (err) throw err;
      res(console.log("New user created!"));
    });
  });
}

// Delete user by username
exports.deleteUser = (username, res) => {
  let sql = 'DELETE FROM users WHERE username = ?';
  pool.getConnection((error, connection) => {
    if (error) throw error;
    connection.query(sql, [username], (err, result) => {
      connection.release();
      if (err) throw err;
      res(console.log("deleted user"));
    });
  });
}

// Search user by name
exports.searchUserByName = (username, res) => {
  let sql = 'SELECT * FROM users WHERE username = ?';
  pool.getConnection((error, connection) => {
    if(error) throw error;
    connection.query(sql, [username], (err, result) => {
      connection.release();
      if (err) throw err;
      res(result);
    });
  });
}

// Search user by id
exports.searchUserByID = (id, res) => {
  let sql = 'SELECT * FROM users WHERE id = ?';
  pool.getConnection((error, connection) => {
    if(error) throw error;
    connection.query(sql, [id], (err, result) => {
      connection.release();
      if (err) throw err;
      res(result);
    });
  });
}

// Edit user credit amount
exports.editCredits = (username, amount, res) => {
  let sql = `UPDATE users SET credit = credit + "${amount}" WHERE username = "${username}"`;
  pool.getConnection((error, connection) => {
    if (error) throw error;
    connection.query(sql, (err, result) => {
      connection.release();
      if (err) throw err;
      res(result);
    });
  });
}

// Search all items
exports.searchAll = (res) => {
  let sql = "SELECT * FROM items ORDER BY category DESC";
  pool.getConnection((error, connection) => {
    if(error) throw error;
    connection.query(sql, (err, result) => {
      connection.release();
      if (err) throw err;
      res(result);
    });
  });
}

// Search item by title
exports.search = (keyword, res) => {
  let sql = 'SELECT * FROM items WHERE title = ?';
  pool.getConnection((error, connection) => {
    if(error) throw error;
    connection.query(sql, [keyword], (err, result) => {
      connection.release();
      if (err) throw err;
      res(result);
    });
  });
}

// Search all tools
exports.searchAllTools = (res) => {
  let sql = `SELECT * FROM items WHERE category = "${"Tools"}"`;
  pool.getConnection((error, connection) => {
    if(error) throw error;
    connection.query(sql, (err, result) => {
      connection.release();
      if (err) throw err;
      res(result);
    });
  });
}

// Search all miscellaneous
exports.searchAllMiscellaneous = (res) => {
  let sql = `SELECT * FROM items WHERE category = "${"Miscellaneous"}"`;
  pool.getConnection((error, connection) => {
    if(error) throw error;
    connection.query(sql, (err, result) => {
      connection.release();
      if (err) throw err;
      res(result);
    });
  });
}

// Add new item
exports.addItem = (item, res) => {
  let sql = "INSERT INTO items SET ?";
  pool.getConnection((error, connection) => {
    if (error) throw error;
    connection.query(sql, item, (err, result) => {
      connection.release();
      if (err) throw err;
      res(result);
    });
  });
}

// Edit stock amount
exports.editStock = (id, stock, res) => {
  let sql = `UPDATE items SET stock = stock + "${stock}" WHERE id = "${id}"`;
  pool.getConnection((error, connection) => {
    if (error) throw error;
    connection.query(sql, (err, result) => {
      connection.release();
      if (err) throw err;
      res(result);
    });
  });
}

// Delete item by id
exports.deleteItem = (id, res) => {
  let sql = 'DELETE FROM items WHERE id = ?';
  pool.getConnection((error, connection) => {
    if (error) throw error;
    connection.query(sql, [id], (err, result) => {
      connection.release();
      if (err) throw err;
      res(console.log("deleted item"));
    });
  });
}

// Add item to cart
exports.addToCart = (id, res) => {
  let sql = 'SELECT * FROM items WHERE id = ?';
  pool.getConnection((error, connection) => {
    if (error) throw error;
    connection.query(sql, [id], (err, result) => {
      connection.release();
      if (err) throw err;
      res(result);
    });
  });
}

// ************************** Predefined queries *******************************

//Create database "store"
exports.createDatabase = (res) => {
  let sql = "CREATE DATABASE store";
  pool.getConnection((error, connection) => {
    if(error) throw error;
    connection.query(sql, (err, result) => {
      connection.release();
      if (err) throw err;
      res(console.log("Database created!"));
    });
  });
}

//Create table "items"
exports.createTableItems = (res) => {
  let sql = "CREATE TABLE items(id int AUTO_INCREMENT, category VARCHAR(255), title VARCHAR(255), description VARCHAR(255), price int, stock int, PRIMARY KEY (id))";
  pool.getConnection((error, connection) => {
    if(error) throw error;
    connection.query(sql, (err, result) => {
      connection.release();
      if (err) throw err;
      res(console.log("Table items created!"));
    });
  });
}

//Create table "users"
exports.createTableUsers = (res) => {
  let sql = "CREATE TABLE users(id int AUTO_INCREMENT, username VARCHAR(255), password VARCHAR(255), role VARCHAR(255), credit int(10), PRIMARY KEY (id))";
  pool.getConnection((error, connection) => {
    if(error) throw error;
    connection.query(sql, (err, result) => {
      connection.release();
      if (err) throw err;
      res(console.log("Table users created!"));
    });
  });
}

//Add admin "Hande" to users
exports.addAdmin = (res) => {
  let user = {username: "Hande", password: "Hande123", role: "admin", credit: 1000};
  bcrypt.hash(user.password, (hash) => {
    user.password = hash;
    let sql = "INSERT INTO users SET ?";
    pool.getConnection((error, connection) => {
      if(error) throw error;
      connection.query(sql, user, (err, result) => {
        connection.release();
        if (err) throw err;
        res(console.log("Admin user created!"));
      });
    });
  });
}

//Add employee "Bob" to users
exports.addEmployee = (res) => {
  let user = {username: "Bob", password: "Bob123", role: "employee", credit: 1000};
  bcrypt.hash(user.password, (hash) => {
    user.password = hash;
    let sql = "INSERT INTO users SET ?";
    pool.getConnection((error, connection) => {
      if(error) throw error;
      connection.query(sql, user, (err, result) => {
        connection.release();
        if (err) throw err;
        res(console.log("Admin user created!"));
      });
    });
  });
}

//Add customer "Pena" to users
exports.addCustomer = (res) => {
  let user = {username: "Pena", password: "Pena123", role: "customer", credit: 1000};
  bcrypt.hash(user.password, (hash) => {
    user.password = hash;
    let sql = "INSERT INTO users SET ?";
    pool.getConnection((error, connection) => {
      if(error) throw error;
      connection.query(sql, user, (err, result) => {
        connection.release();
        if (err) throw err;
        res(console.log("Admin user created!"));
      });
    });
  });
}

// Add new item
exports.populateItems = (res) => {
  let items = [
    ["Tools", "Hammer", "Very good hammer", 10, 10],
    ["Tools", "Nails", "A pack of 100 nails", 5, 20],
    ["Tools", "Saw", "Decent saw", 8, 10],
    ["Tools", "Chainsaw", "Superb", 10, 5],
    ["Tools", "Screwdriver", "Philips", 6, 10],
    ["Tools", "Glue", "Super strong glue", 15, 10],
    ["Miscellaneous", "Cigarettes", "Not good for you", 2, 50],
    ["Miscellaneous", "Beer", "You might need this", 1, 100],
    ["Miscellaneous", "Booze", "0,5l homemade booze, tastes horrible", 3, 8]
  ];
  let sql = "INSERT INTO items (category, title, description, price, stock) VALUES ?";
  pool.getConnection((error, connection) => {
    if (error) throw error;
    connection.query(sql, [items], (err, result) => {
      connection.release();
      if (err) throw err;
      res(console.log("Items populated!"));
    });
  });
}
