// const multer = require("multer");
// const path = require("path");

// const storage = multer.diskStorage({
//   destination: (req, file, callback) => {
//     console.log(path.join(__dirname, "../public/"));
//     callback(null, path.join(__dirname, "../public/"));
//   },
//   filename: (req, file, callback) => {
//     callback(null, new Date().getTime().toString() + "-" + file.originalname);
//   },
// });
// const fileFilter = (req, file, cb) => {
//   if (
//     file.mimetype === "image/jpeg" ||
//     file.mimetype === "image/jpg" ||
//     file.mimetype === "image/png" ||
//     file.mimetype === "image/gif"
//   ) {
//     cb(null, true);
//   } else {
//     req.fileError = "Upload image file (jpeg/jpg or png)!";
//     cb(null, false);
//   }
// };

// const uploadMiddleware = (name, isSingle) => {
//   return (req, res, next) => {
//     let upload;
//     if (isSingle === undefined) {
//       upload = multer({
//         storage: storage,
//         limits: {
//           fileSize: 1024 * 1024 * 5,
//         },
//         fileFilter: fileFilter,
//       }).single(name);
//     } else {
//       upload = multer({
//         storage: storage,
//         limits: {
//           fileSize: 1024 * 1024 * 5,
//         },
//         fileFilter: fileFilter,
//       }).array(name, 10);
//     }

//     upload(req, res, function (err) {
//       if (err instanceof multer.MulterError) {
//         const err = new Error("Multer error");
//         return res.status(500).json({
//           success: false,
//           error: err.message,
//         });
//       }
//       if (req.fileError) {
//         return res.status(415).json({
//           success: false,
//           error: {
//             logo: req.fileError,
//           },
//         });
//       } else if (err) {
//         console.log(err);
//         //  const err = new Error('Server Error')
//         return res.status(500).json({
//           success: false,
//           error: err,
//         });
//       }

//       next();
//     });
//   };
// };

// module.exports = uploadMiddleware;


const cloudinary = require('cloudinary').v2;

// Configure Cloudinary with your credentials
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, // Replace with your Cloudinary cloud name
  api_key: process.env.CLOUDINARY_API_KEY, // Replace with your Cloudinary API key
  api_secret: process.env.CLOUDINARY_API_SECRET // Replace with your Cloudinary API secret
});

/**
 * Upload file to Cloudinary
 * @param {string} filePath - The path of the file to be uploaded
 * @returns {Promise} - Resolves with Cloudinary response object or rejects with error
 */
const uploadMiddleware = (filePath) => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload(filePath, (error, result) => {
      if (error) {
        reject(error);
      } else {
        resolve(result);
      }
    });
  });
};

module.exports = { uploadMiddleware };
