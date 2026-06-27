'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Classrooms', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      classroom_name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      classroom_type: {
        type: Sequelize.ENUM,
        values: ["theory", "lab"],
        allowNull: false
      },
      classroom_status: {
        type: Sequelize.ENUM,
        values: ["available", "occupied"],
        allowNull: false
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Classrooms');
  }
};