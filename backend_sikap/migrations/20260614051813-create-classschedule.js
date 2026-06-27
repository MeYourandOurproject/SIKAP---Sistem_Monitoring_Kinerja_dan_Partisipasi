'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Classschedules', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      day: {
        type: Sequelize.STRING,
        allowNull: false
      },
      class_id: {
        type: Sequelize.INTEGER,
        references: { model: 'Classes', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
      teacher_id: {
        type: Sequelize.INTEGER,
        references: { model: 'Teachers', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
      subject_id: {
        type: Sequelize.INTEGER,
        references: { model: 'Subjects', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
      classroom_id: {
        type: Sequelize.INTEGER,
        references: { model: 'Classrooms', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
      start_timeslot_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: { model: 'Timeslots', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
      end_timeslot_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: { model: 'Timeslots', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
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
    await queryInterface.dropTable('Classschedules');
  }
};