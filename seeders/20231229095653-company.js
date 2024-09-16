"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
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
        "companies",
        [
          {
            name: "Nepathya Media Pvt. Ltd.",
            logo_id: 1,
            slogan: "Media company",
            phone_no: "9876543210",
            external_phoneno: "9876543210",
            email: "NepathyaMedia@gmail.com",
            sanchalak: "Nepathya Media",
            reporter: "Nepathya Media",
            salahakar: "Nepathya Media",
            privacypolicy: "Nepathya Media",
            ji_pra_ka_ru_d_no: "1234567",
            media_biva_registration_cretificate_no: "1234567",
            press_council_registration_no: "1234567",
            local_pra_registration_no: "1234567",
            company_description: "Nepathya Media",
            pradhan_sanchalak: "Nepathya Media",
            created_at: new Date(),
            updated_at: new Date(),
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
     * await queryInterface.bulkDelete('People', null, {});
     */
  },
};
