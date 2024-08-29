const removeFile = require("../utils/remove_file");
const validator = require("../utils/validator");
const postValidation = async (req, res, next) => {
  const validationRule = {
    featured_image: "required",
    title: "required|string",
    body: "required|string",
    category_id: "required|integer",
    author: "required|string",
    is_mukhya_samachar: "required|integer",
  };

  if (req.file != undefined) {
    delete validationRule["featured_image"];
  }
  await validator(req.body, validationRule, {}, (err, status) => {
    if (!status) {
      const errValue = err.errors;
      if (req.file != undefined) {
        removeFile(req.file.filename);
      }
      return res.status(422).send({
        success: false,
        error: errValue,
      });
    }
    next();
  }).catch((err) => {
    if (req.file != undefined) {
      removeFile(req.file.filename);
    }
    return res.status(500).send({
      success: false,
      error: "server error",
    });
  });
};
// const editPostValidation = async (req, res, next) => {
//   const validationRule = {
//     title: "required|string",
//     body: "required|string",
//     category_id: "required|integer",
//     author: "required|string",
//     is_mukhya_samachar: "required|integer",
//   };

//   await validator(req.body, validationRule, {}, (err, status) => {
//     if (!status) {
//       const errValue = err.errors;
//       if (req.file != undefined) {
//         removeFile(req.file.filename);
//       }
//       return res.status(422).send({
//         success: false,
//         error: errValue,
//       });
//     }
//     next();
//   }).catch((err) => {
//     if (req.file != undefined) {
//       removeFile(req.file.filename);
//     }
//     return res.status(500).send({
//       success: false,
//       error: "server error",
//     });
//   });
// };
module.exports = {postValidation
  // ,editPostValidation
};
