const removeFile = require("../utils/remove_file");
const validator = require("../utils/validator");

const postValidation = async (req, res, next) => {
  const validationRule = {
    featured_imageUrl: "required",
    title: "required|string",
    body: "required|string",  
    category_id: "required|integer",
    author: "required|string",
    is_mukhya_samachar: "required|integer",
  };

  if (req.files != undefined) {
    delete validationRule["featured_image"];
  }
  await validator(req.body, validationRule, {}, (err, status) => {

    
    
    if (!status) {
      const errValue = err.errors;
      if (req.files != undefined) {
        cloudinary.uploader.destroy(req.files.featured_image.name);
      }
      return res.status(422).send({
        success: false,
        error: errValue,
      });
    }
    next();
  }).catch((err) => {
    if (req.files != undefined) {
      cloudinary.uploader.destroy(req.files.featured_image.name);
    }
    return res.status(500).send({
      success: false,
      error: "server error",
    });
  });
};
module.exports = {postValidation
};
