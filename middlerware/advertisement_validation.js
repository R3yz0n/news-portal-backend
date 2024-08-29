const validator = require("../utils/validator");
const advertisementValidation = async (req, res, next) => {
  const validationRule = {
    rate: "required|integer",
  };
  await validator(req.body, validationRule, {}, (err, status) => {
    if (!status) {
      const errValue = err.errors;
      return res.status(422).send({
        success: false,
        error: errValue,
      });
    }
    next();
  }).catch((err) => {
    console.log(err);
    return res.status(500).send({
      success: false,
      error: "server error",
    });
  });
};
module.exports = {advertisementValidation};
