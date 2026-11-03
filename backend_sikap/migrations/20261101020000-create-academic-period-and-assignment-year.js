"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const now = new Date();
    await queryInterface.createTable("AcademicPeriods", {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      academic_year: {
        allowNull: false,
        type: Sequelize.STRING(9),
      },
      semester: {
        allowNull: false,
        type: Sequelize.ENUM("odd", "even"),
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

    await queryInterface.bulkInsert("AcademicPeriods", [
      {
        id: 1,
        academic_year: "2026/2027",
        semester: "odd",
        createdAt: now,
        updatedAt: now,
      },
    ]);

    await queryInterface.addColumn("Teacherassignments", "academic_year", {
      type: Sequelize.STRING(9),
      allowNull: true,
    });
    await queryInterface.sequelize.query(
      "UPDATE `Teacherassignments` SET `academic_year` = '2026/2027' WHERE `academic_year` IS NULL",
    );
    await queryInterface.changeColumn("Teacherassignments", "academic_year", {
      type: Sequelize.STRING(9),
      allowNull: false,
    });

    await queryInterface.addColumn("Activitysessions", "academic_year", {
      type: Sequelize.STRING(9),
      allowNull: true,
    });
    await queryInterface.addColumn("Activitysessions", "semester", {
      type: Sequelize.ENUM("odd", "even"),
      allowNull: true,
    });
    await queryInterface.sequelize.query(
      "UPDATE `Activitysessions` SET `academic_year` = '2026/2027', `semester` = 'odd' WHERE `academic_year` IS NULL",
    );
  },

  async down(queryInterface) {
    await queryInterface.removeColumn("Activitysessions", "semester");
    await queryInterface.removeColumn("Activitysessions", "academic_year");
    await queryInterface.removeColumn("Teacherassignments", "academic_year");
    await queryInterface.dropTable("AcademicPeriods");
  },
};
