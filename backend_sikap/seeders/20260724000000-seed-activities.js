"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    const now = new Date();

    await queryInterface.bulkInsert(
      "Activities",
      [
        {
          name: "Panca Waluya",
          type: "routine",
          description: "Kegiatan pagi rutin setiap Senin-Jumat, 06.30-07.00, tema berbeda setiap hari.",
          target_type: "all_teachers",
          createdAt: now,
          updatedAt: now,
        },
        {
          name: "Piket 5S",
          type: "routine",
          description: "Piket kebersihan 5S setiap Senin-Jumat oleh guru bergilir, dengan pembagian semester ganjil/genap.",
          target_type: "assigned_teachers",
          createdAt: now,
          updatedAt: now,
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete(
      "Activities",
      {
        name: ["Panca Waluya", "Piket 5S"],
      },
      {}
    );
  },
};
