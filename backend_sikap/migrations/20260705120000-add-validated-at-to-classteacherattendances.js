'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('Classteacherattendances', 'validated_at', {
      type: Sequelize.DATE,
      allowNull: true,
      after: 'validator_id',
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('Classteacherattendances', 'validated_at');
  },
};
