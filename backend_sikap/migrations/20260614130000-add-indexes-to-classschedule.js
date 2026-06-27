'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addIndex('Classschedules', ['class_id', 'day', 'start_timeslot_id'], {
      name: 'idx_class_day_start_timeslot',
    });
    await queryInterface.addIndex('Classschedules', ['teacher_id', 'day', 'start_timeslot_id'], {
      name: 'idx_teacher_day_start_timeslot',
    });
    await queryInterface.addIndex('Classschedules', ['classroom_id', 'day', 'start_timeslot_id'], {
      name: 'idx_classroom_day_start_timeslot',
    });
    await queryInterface.addIndex('Classschedules', ['day', 'start_timeslot_id'], {
      name: 'idx_day_start_timeslot',
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeIndex('Classschedules', 'idx_class_day_start_timeslot');
    await queryInterface.removeIndex('Classschedules', 'idx_teacher_day_start_timeslot');
    await queryInterface.removeIndex('Classschedules', 'idx_classroom_day_start_timeslot');
    await queryInterface.removeIndex('Classschedules', 'idx_day_start_timeslot');
  }
};
