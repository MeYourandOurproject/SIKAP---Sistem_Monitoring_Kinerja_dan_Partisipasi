'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Timeslots', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      schema: {
        type: Sequelize.STRING,
        allowNull: false
      },
      jp: {
        type: Sequelize.STRING,
        allowNull: false
      },
      start: {
        type: Sequelize.TIME,
        allowNull: false
      },
      end: {
        type: Sequelize.TIME,
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
    await queryInterface.dropTable('Timeslots');
  }
};