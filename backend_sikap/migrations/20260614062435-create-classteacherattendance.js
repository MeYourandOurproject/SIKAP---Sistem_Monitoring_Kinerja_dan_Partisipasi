'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Classteacherattendances', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      date: {
        type: Sequelize.DATE,
        allowNull: false
      },
      teacher_id: {
        type: Sequelize.INTEGER,
        references: { model: 'Teachers', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
      class_id: {
        type: Sequelize.INTEGER,
        references: { model: 'Classes', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
      attendace_status: {
        type: Sequelize.ENUM,
        values: ["present", "permission", "absent"],
        allowNull: false
      },
      activity_status: {
        type: Sequelize.ENUM,
        values: ["teaching", "empty", "assignment"],
        allowNull: false
      },
      validator_id: {
        type: Sequelize.INTEGER,
        references: { model: 'Users', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
      notes: {
        type: Sequelize.STRING
      },
      latenes: {
        type: Sequelize.INTEGER
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
    await queryInterface.dropTable('Classteacherattendances');
  }
};