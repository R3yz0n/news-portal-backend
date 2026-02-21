"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert("clients", [
      {
        name: "Sita Shrestha",
        phone_no: "9801234567",
        address: "Kathmandu, Nepal",
        created_at: new Date(),
        updated_at: new Date(),
        total: 10000,
      },
      {
        name: "Ram Karki",
        phone_no: "9802345678",
        address: "Biratnagar, Nepal",
        created_at: new Date(),
        updated_at: new Date(),
        total: 8000,
      },
      {
        name: "Gita Rai",
        phone_no: "9803456789",
        address: "Pokhara, Nepal",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name: "Hari Sharma",
        phone_no: "9804567890",
        address: "Lalitpur, Nepal",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name: "Maya Gurung",
        phone_no: "9805678901",
        address: "Dharan, Nepal",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name: "Bishnu Adhikari",
        phone_no: "9806789012",
        address: "Chitwan, Nepal",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name: "Sunita Tamang",
        phone_no: "9807890123",
        address: "Bhaktapur, Nepal",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name: "Prakash Thapa",
        phone_no: "9808901234",
        address: "Butwal, Nepal",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name: "Rita Magar",
        phone_no: "9809012345",
        address: "Hetauda, Nepal",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name: "Manoj Khadka",
        phone_no: "9800123456",
        address: "Janakpur, Nepal",
        created_at: new Date(),
        updated_at: new Date(),
      },
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("clients", null, {});
  },
};
