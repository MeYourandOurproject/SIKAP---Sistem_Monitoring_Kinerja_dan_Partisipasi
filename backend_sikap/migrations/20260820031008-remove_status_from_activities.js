'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    // Menghapus kolom status dari tabel Activities
    await queryInterface.removeColumn('Activities', 'status');
  },

  async down (queryInterface, Sequelize) {
    // Menambahkan kembali kolom status jika migration di-rollback
    await queryInterface.addColumn('Activities', 'status', {
      type: Sequelize.ENUM('planned', 'ongoing', 'completed', 'cancelled'),
      defaultValue: 'planned',
      allowNull: true,
    });
  }
};