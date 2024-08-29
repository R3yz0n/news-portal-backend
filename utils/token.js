const jwtKey = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const jwtSecret = process.env.JWTSECRET;
module.exports = {
  getToken: function (data) {
    const token = jwtKey.sign(
      { id: data.id, isAdmin: data.isAdmin },
      jwtSecret,
      {
        algorithm: "HS256",
        expiresIn: 86000,
      }
    );
    return token;
  },

  comparePassword: async function (password, HashPassword) {
    const value = await bcrypt.compare(password, HashPassword);
    return value;
  },
};
