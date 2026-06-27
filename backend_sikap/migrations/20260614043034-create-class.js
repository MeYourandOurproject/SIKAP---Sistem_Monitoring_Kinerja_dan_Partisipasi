'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Classes', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      class_name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      major: {
        type: Sequelize.STRING,
        allowNull: false
      },
      level: {
        type: Sequelize.STRING,
        allowNull: false
      },
      classleader_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: { model: 'Users', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
      classleader_contact: {
        type: Sequelize.STRING,
        allowNull: true
      },
      classteacher_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: { model: 'Teachers', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
      classteacher_contact: {
        type: Sequelize.STRING,
        allowNull: true
      },
      total_student: {
        type: Sequelize.INTEGER,
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
    await queryInterface.dropTable('Classes');
  }
};