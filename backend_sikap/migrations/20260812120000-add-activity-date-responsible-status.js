'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('Activities', 'date', {
      type: Sequelize.DATEONLY,
      allowNull: true,
    });

    await queryInterface.addColumn('Activities', 'responsiblePerson', {
      type: Sequelize.STRING,
      allowNull: true,
    });

    await queryInterface.addColumn('Activities', 'status', {
      type: Sequelize.ENUM('planned', 'ongoing', 'completed', 'cancelled'),
      allowNull: false,
      defaultValue: 'planned',
    });
  },

  async down(queryInterface) {
    await queryInterface.removeColumn('Activities', 'status');
    await queryInterface.removeColumn('Activities', 'responsiblePerson');
    await queryInterface.removeColumn('Activities', 'date');
  },
};
