"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      "categories",
      [
        {
          name: "समाचार",
          slug: "समाचार",
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          name: "अन्तर्राष्ट्रिय",
          slug: "अन्तर्राष्ट्रिय",
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          name: "अर्थ-वाणिज्य",
          slug: "अर्थ-वाणिज्य",
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          name: "राजनीति",
          slug: "राजनीति",
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          name: "शिक्षा",
          slug: "शिक्षा",
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          name: "स्वास्थ्य",
          slug: "स्वास्थ्य",
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          name: "फोटो-फिचर",
          slug: "फोटो-फिचर",
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          name: "विज्ञान-र-प्रविधि",
          slug: "विज्ञान-र-प्रविधि",
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          name: "खेलकुद",
          slug: "खेलकुद",
          created_at: new Date(),
          updated_at: new Date(),
        },
        // Add more categories as needed
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    // Remove seed data here
    await queryInterface.bulkDelete("categories", null, {});
  },
};
