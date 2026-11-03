"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Studentattendances", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      student_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: "Students", key: "id" },
        onUpdate: "CASCADE",
        onDelete: "RESTRICT",
      },
      classschedule_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: "Classschedules", key: "id" },
        onUpdate: "CASCADE",
        onDelete: "RESTRICT",
      },
      attendance_date: {
        type: Sequelize.DATEONLY,
        allowNull: false,
      },
      attendance_status: {
        type: Sequelize.ENUM("present", "permission", "sick", "absent"),
        allowNull: false,
      },
      marked_by: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: "Users", key: "id" },
        onUpdate: "CASCADE",
        onDelete: "RESTRICT",
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

    await queryInterface.addIndex(
      "Studentattendances",
      ["student_id", "classschedule_id", "attendance_date"],
      { unique: true, name: "student_attendance_schedule_date_unique" },
    );
  },

  async down(queryInterface) {
    await queryInterface.dropTable("Studentattendances");
  },
};
