'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      "socialmedia",
      [
        {
          name:"Facebook",
          social_media_link:"facebook.com",
          company_id:1,
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          name:"Instagram",
          social_media_link:"instagram.com",
          company_id:1,
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          name:"Youtube",
          social_media_link:"youtube.com",
          company_id:1,
          created_at: new Date(),
          updated_at: new Date(),
        }
        // Add more categories as needed
      ],
      {}
    );
  },


  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
};
