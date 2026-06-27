"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // 1. Add classschedule_id column
    await queryInterface.addColumn(
      "Classteacherattendances",
      "classschedule_id",
      {
        type: Sequelize.INTEGER,
        after: "date",
        allowNull: true,
        references: {
          model: "Classschedules",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
    );

    // 2. Delete teacher_id
    await queryInterface.removeColumn("Classteacherattendances", "teacher_id");

    // 3. Delete class_id
    await queryInterface.removeColumn("Classteacherattendances", "class_id");

    // 4. Rename attendace_status to attendance_status
    await queryInterface.renameColumn(
      "Classteacherattendances",
      "attendace_status",
      "attendance_status",
    );

    // 5. Rename latenes to lateness
    await queryInterface.renameColumn(
      "Classteacherattendances",
      "latenes",
      "lateness",
    );

    // // 6. add validator_id column
    // await queryInterface.addColumn("Classteacherattendances", "validator_id", {
    //   type: Sequelize.DATE,
    //   allowNull: true,
    //   after: "activity_status",
    // });

    await queryInterface.addIndex(
      "Classteacherattendances",
      ["date", "classschedule_id"],
      {
        unique: true,
        name: "uniq_attendance_per_schedule_per_day",
      },
    );
  },

  async down(queryInterface, Sequelize) {
    // Hapus validated_at
    await queryInterface.removeColumn(
      "Classteacherattendances",
      "validated_at",
    );

    // Rename lateness -> latenes
    await queryInterface.renameColumn(
      "Classteacherattendances",
      "lateness",
      "latenes",
    );

    // Rename attendance_status -> attendace_status
    await queryInterface.renameColumn(
      "Classteacherattendances",
      "attendance_status",
      "attendace_status",
    );

    // Tambah kembali teacher_id
    await queryInterface.addColumn("Classteacherattendances", "teacher_id", {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: "Teachers",
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "SET NULL",
    });

    // Tambah kembali class_id
    await queryInterface.addColumn("Classteacherattendances", "class_id", {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: "Classes",
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "SET NULL",
    });

    // Hapus classschedule_id
    await queryInterface.removeColumn(
      "Classteacherattendances",
      "classschedule_id",
    );
  },
};
