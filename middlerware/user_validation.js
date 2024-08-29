const validator = require("../utils/validator");
const removeFile = require("../utils/remove_file");
const userValidation = async (req, res, next) => {
  const validationRule = {
    fullname: "required|string",
    username: "required|string",
    address: "required|string",
    password: "required|string",
    phone_no: "required|string",
    profile_image: "required",
  };
  validationRule["gender"] = ["required", { in: ["male", "female", "other"] }];
  if (req.file !== undefined) {
    delete validationRule["profile_image"];
  }

  await validator(req.body, validationRule, {}, (err, status) => {
    if (!status) {
      if (req.file !== undefined) {
        removeFile(req.file.filename);
      }
      const errValue = err.errors;
      return res.status(422).send({
        success: false,
        error: errValue,
      });
    }
    next();
  }).catch((err) => {
    if (req.file !== undefined) {
      removeFile(req.file.filename);
    }
    console.log(err);
    return res.status(500).send({
      success: false,
      error: "server error",
    });
  });
};

const editUserValidation = async (req, res, next) => {
  const validationRule = {
    fullname: "required|string",
    address: "required|string",
    phone_no: "required|string",
  };
  validationRule["gender"] = ["required", { in: ["male", "female", "other"] }];

  await validator(req.body, validationRule, {}, (err, status) => {
    if (!status) {
      if (req.file !== undefined) {
        removeFile(req.file.filename);
      }
      const errValue = err.errors;
      return res.status(422).send({
        success: false,
        error: errValue,
      });
    }
    next();
  }).catch((err) => {
    if (req.file !== undefined) {
      removeFile(req.file.filename);
    }
    console.log(err);
    return res.status(500).send({
      success: false,
      error: "server error",
    });
  });
};
module.exports = {
  userValidation,
  editUserValidation,
};
