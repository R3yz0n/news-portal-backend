"use strict";
const bcrypt = require("bcrypt");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const salt = bcrypt.genSaltSync(10);

    const hash = bcrypt.hashSync("password@123", salt);

    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
     */
    try {
      await queryInterface.bulkInsert(
        "users",
        [
          {
            password: hash,
            fullname: "Admin",
            username: "admin@admin.com",
            address: "address",
            phone_no: "9867255019",
            gender: "male",
            user_profile_id: 1,
            role: "admin",
            created_at: "2023-12-04 12:39:29",
            updated_at: "2023-12-04 12:39:29",
          },
        ],
        {}
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
    //  * await queryInterface.bulkDelete('People', null, {});
     */
  },
};
