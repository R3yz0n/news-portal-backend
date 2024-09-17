const removeFile = require("../utils/remove_file");
const validator = require("../utils/validator");

const postValidation = async (req, res, next) => {
  const validationRule = {
    title: "required|string",
    body: "required|string",  
    category_id: "required|integer",
    author: "required|string",
    is_mukhya_samachar: "required|integer",
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
    return res.status(500).send({
      success: false,
      error: "server error",
    });
  });
};
module.exports = {postValidation
};
