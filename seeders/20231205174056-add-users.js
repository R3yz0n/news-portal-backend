"use strict";
const bcrypt = require("bcrypt");
require("dotenv").config(); // Load environment variables

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const salt = bcrypt.genSaltSync(10);

    const hash = bcrypt.hashSync(process.env.ADMIN_PASSWORD, salt); // Load password from env

    const users = [
      {
        password: hash,
        fullname: "Admin",
        username: process.env.ADMIN_USERNAME,
        address: "address",
        phone_no: "9947039999",
        gender: "male",
        user_profile_id: 1,
        role: "admin",
        created_at: new Date(),
        updated_at: new Date(),
      },
    ];

    for (let i = 2; i <= 25; i++) {
      users.push({
        password: hash,
        fullname: `User${i - 1}`,
        username: `user${i - 1}@test.com`,
        address: "address",
        phone_no: `99470399${i.toString().padStart(2, "0")}`,
        gender: "male",
        user_profile_id: i,
        role: "user",
        created_at: new Date(),
        updated_at: new Date(),
      });
    }

    try {
      await queryInterface.bulkInsert("users", users, {});
    } catch (error) {
      console.log(error);
    }
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("users", null, {});
  },
};
