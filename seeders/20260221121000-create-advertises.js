"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const path = require("path");
    const fs = require("fs");
    const cloudinary = require("cloudinary").v2;
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });

    // List of images for each ad
    const adImages = [
      "popup.gif",
      "topbar.png",
      "right_sidebar.gif",
      "popup.gif",
      "topbar.png",
      "right_sidebar.gif",
    ];
    const imagesDir = path.join(__dirname, "images");
    const fileUploadIds = [];
    for (const imageFile of adImages) {
      const imagePath = path.join(imagesDir, imageFile);
      const fileStats = fs.statSync(imagePath);
      const fileSize = fileStats.size;
      const fileType = path.extname(imageFile).replace(".", "");
      const uploadResult = await new Promise((resolve, reject) => {
        cloudinary.uploader.upload(imagePath, (error, result) => {
          if (error) reject(error);
          else resolve(result);
        });
      });
      const fileUploadResult = await queryInterface.bulkInsert(
        "fileuploads",
        [
          {
            name: uploadResult.public_id,
            size: fileSize.toString(),
            type: fileType,
            created_at: new Date(),
            updated_at: new Date(),
          },
        ],
        { returning: true },
      );
      let fileUploadId = 1;
      if (Array.isArray(fileUploadResult) && fileUploadResult[0] && fileUploadResult[0].id) {
        fileUploadId = fileUploadResult[0].id;
      } else if (fileUploadResult && fileUploadResult.id) {
        fileUploadId = fileUploadResult.id;
      } else if (typeof fileUploadResult === "number") {
        fileUploadId = fileUploadResult;
      }
      fileUploadIds.push(fileUploadId);
    }

    await queryInterface.bulkInsert("advertises", [
      {
        name: "Sita Shrestha Ad",
        description: "Advertisement for Sita Shrestha",
        advertisement_id: 1,
        user_id: 1,
        client_id: 1,
        image: fileUploadIds[0],
        start_date: new Date(),
        end_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        total_price: "10000",
        status: true,
        discount: 0,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name: "Ram Karki Ad",
        description: "Advertisement for Ram Karki",
        advertisement_id: 2,
        user_id: 2,
        client_id: 2,
        image: fileUploadIds[1],
        start_date: new Date(),
        end_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        total_price: "8000",
        status: true,
        discount: 0,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name: "Gita Rai Ad",
        description: "Advertisement for Gita Rai",
        advertisement_id: 3,
        user_id: 3,
        client_id: 3,
        image: fileUploadIds[2],
        start_date: new Date(),
        end_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        total_price: "9000",
        status: true,
        discount: 0,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name: "Hari Sharma Ad",
        description: "Advertisement for Hari Sharma",
        advertisement_id: 3,
        user_id: 4,
        client_id: 4,
        image: fileUploadIds[3],
        start_date: new Date(),
        end_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        total_price: "7000",
        status: true,
        discount: 0,
        created_at: new Date(),
        updated_at: new Date(),
      },
    ]);

    // Create transaction records for each advertise
    await queryInterface.bulkInsert("transactions", [
      {
        client_id: 1,
        paid: 100,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        client_id: 2,
        paid: 0,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        client_id: 3,
        paid: 0,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        client_id: 4,
        paid: 0,
        created_at: new Date(),
        updated_at: new Date(),
      },
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("advertises", null, {});
  },
};
