const jwt = require("jsonwebtoken");

function tokenVerification(req, res, next) {
  let token = req.headers.authorization;
  const jwtScret = process.env.JWTSECRET;

  if (!token) {
    return res.status(401).send({ success: false, error: "Missing Token ." });
  }
  token = token.split(" ")[1];

  jwt.verify(token, jwtScret, function (err, decoded) {
    if (err) {
      return res
        .status(401)
        .send({ success: false, error: "unauthentication token." });
    }
    req.user_id = decoded.id;
    req.isAdmin = decoded.isAdmin;
    next();
  });
}
module.exports = tokenVerification;
