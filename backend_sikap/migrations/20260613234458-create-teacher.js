"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Teachers", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      nip: {
        type: Sequelize.STRING,
        unique: true,
        allowNull: true,
      },
      nuptk: {
        type: Sequelize.STRING,
        unique: true,
        allowNull: true,
      },
      gender: {
        type: Sequelize.ENUM,
        values: ["Male", "Female"],
        allowNull: false,
      },
      ptk_type: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      gtk_type: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      status: {
        type: Sequelize.ENUM,
        values: ["active", "inactive"],
        allowNull: false,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("Teachers");
  },
};
