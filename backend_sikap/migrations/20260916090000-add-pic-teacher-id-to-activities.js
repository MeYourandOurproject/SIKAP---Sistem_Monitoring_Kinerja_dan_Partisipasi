'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('Activities', 'pic_teacher_id', {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: 'Teachers',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
    });
  },

  async down(queryInterface) {
    await queryInterface.removeColumn('Activities', 'pic_teacher_id');
  },
};
