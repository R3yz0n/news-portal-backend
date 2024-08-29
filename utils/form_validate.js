const { check, validationResult } = require("express-validator");
const models = require("../models");
const fs = require("fs");


exports.validateAdmin = [
  check("email")
    .notEmpty()
    .withMessage("email cannot be empty!!"),
  check("password")
    .notEmpty()
    .withMessage("password is required!!"),
    
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
    next();
  },
];