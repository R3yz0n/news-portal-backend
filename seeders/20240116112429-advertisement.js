"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      "advertisements",
      [
        {
          type: "popup",
          rate: 0,
          max_count: 1,
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          type: "right_sidebar",
          rate: 0,
          max_count: 15,
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          type: "topbar_ad",
          rate: 0,
          max_count: 1,
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          type: "end_category_ad",
          rate: 0,
          max_count: 9,
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          type: "post_detail_ad",
          rate: 0,
          max_count: 100,
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          type: "specific_category_ad",
          rate: 0,
          max_count: 9,
          created_at: new Date(),
          updated_at: new Date(),
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {},
};
