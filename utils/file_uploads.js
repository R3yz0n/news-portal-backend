const cloudinary = require("cloudinary").v2;

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, // Replace with your Cloudinary cloud name
  api_key: process.env.CLOUDINARY_API_KEY, // Replace with your Cloudinary API key
  api_secret: process.env.CLOUDINARY_API_SECRET, // Replace with your Cloudinary API secret
});

/**
 * Function to upload file to Cloudinary
 * @param {object} file - The file object from `express-fileupload`
 * @returns {Promise} - Resolves with Cloudinary response object or rejects with error
 */
const uploadToCloudinary = (file) => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload(file.tempFilePath, (error, result) => {
      if (error) {
        reject(error);
      } else {
        resolve({ secure_url: result.secure_url, public_id: result.public_id });
      }
    });
  });
};

/**
 * Middleware to handle file upload
 * @param {string} name - The field name of the file input in the form
 * @param {boolean} isSingle - Whether to handle a single file or multiple files
 * @returns {function} - The middleware function to handle file uploads
 */
const uploadFile = (name, isSingle = true) => {
  return async (req, res, next) => {
    try {
      // // // Check if files are present
      // if (!req.files || !req.files[name]) {
      //   // return res.status(400).json({ message: "No files were uploaded." });
      //   next();
      // }

      // Single file upload
      if (isSingle && req.files) {
        const file = req.files[name];
        const result = await uploadToCloudinary(file);
        // console.log(result);
        req.body[`${name}Url`] = result.secure_url; // Attach Cloudinary URL to the request body`
      }
      // else {
      //   // Multiple file upload
      //   const files = req.files[name];
      //   const uploadPromises = files.map((file) => uploadToCloudinary(file));
      //   const results = await Promise.all(uploadPromises);
      //   req.body[`${name}Urls`] = results.map((result) => result.secure_url); // Attach Cloudinary URLs to the request body
      // }
      next(); // Proceed to the next middleware or controller
    } catch (error) {
      return res.status(500).json({ message: "File upload failed", error });
    }
  };
};

module.exports = uploadFile;
