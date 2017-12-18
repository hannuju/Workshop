var bcrypt = require("bcrypt");
const saltRounds = 10;

module.exports.hash = (password, res) => {
    bcrypt.hash(password, saltRounds, (err, hash) => {
      if (err) throw err;
      res(hash);
    });
}

module.exports.compare = (password, hash, res) => {
  bcrypt.compare(password, hash, (err, response) => {
    if (err) throw err;
    res(response);
});
}
