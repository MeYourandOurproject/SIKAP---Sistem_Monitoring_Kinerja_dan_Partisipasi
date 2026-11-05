"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    const tableName = "Studentattendances";
    const tables = await queryInterface.showAllTables();
    const tableExists = tables.some((table) => {
      const name = typeof table === "string" ? table : table.tableName;
      return name?.toLowerCase() === tableName.toLowerCase();
    });

    if (!tableExists) {
      await queryInterface.createTable(tableName, {
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
    }

    const indexes = await queryInterface.showIndex(tableName);
    if (
      !indexes.some(
        (index) => index.name === "student_attendance_schedule_date_unique",
      )
    ) {
      await queryInterface.addIndex(
        tableName,
        ["student_id", "classschedule_id", "attendance_date"],
        { unique: true, name: "student_attendance_schedule_date_unique" },
      );
    }
  },

  async down(queryInterface) {
    await queryInterface.dropTable("Studentattendances");
  },
};
