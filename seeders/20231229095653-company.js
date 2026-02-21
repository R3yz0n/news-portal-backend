"use strict";
const path = require("path");
const fs = require("fs");
const cloudinary = require("cloudinary").v2;

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     */
    try {
      // Upload company logo to Cloudinary
      const logoPath = path.join(__dirname, "images", "companylogo.png");

      // Get file stats
      const fileStats = fs.statSync(logoPath);
      const fileSize = fileStats.size;
      const fileType = "png";

      const uploadResult = await new Promise((resolve, reject) => {
        cloudinary.uploader.upload(logoPath, (error, result) => {
          if (error) {
            reject(error);
          } else {
            resolve({ secure_url: result.secure_url, public_id: result.public_id });
          }
        });
      });

      // Insert into fileuploads table first - save the Cloudinary public_id
      const fileUploadResult = await queryInterface.bulkInsert(
        "fileuploads",
        [
          {
            name: uploadResult.public_id, // Save the Cloudinary public_id
            size: fileSize.toString(),
            type: fileType,
            created_at: new Date(),
            updated_at: new Date(),
          },
        ],
        { returning: true },
      );

      // Get the ID of the inserted fileuploads record
      const fileUploadsId = fileUploadResult || 1; // Fallback to 1 if returning not supported

      await queryInterface.bulkInsert(
        "companies",
        [
          {
            name: "Media Company Pvt. Ltd.",
            logo_id: fileUploadsId,
            slogan: "Media company",
            phone_no: "9876543210",
            external_phoneno: "9876543210",
            email: "mediacompany@gmail.com",
            sanchalak: "Media Sanchalak",
            reporter: "Media Reporter",
            salahakar: "Media Salahakar",
            privacypolicy: "Media Company Privacy Policy",
            ji_pra_ka_ru_d_no: "1234567",
            media_biva_registration_cretificate_no: "1234567",
            press_council_registration_no: "1234567",
            local_pra_registration_no: "1234567",
            company_description: "Media Description",
            pradhan_sanchalak: "Media Pradhan Sanchalak",
            created_at: new Date(),
            updated_at: new Date(),
          },
        ],
        {},
      );
    } catch (error) {
      console.log(error);
    }
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  },
};
