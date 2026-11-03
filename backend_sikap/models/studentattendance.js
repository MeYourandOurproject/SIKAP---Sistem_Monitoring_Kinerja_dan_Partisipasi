"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Studentattendance extends Model {
    static associate(models) {
      Studentattendance.belongsTo(models.Student, {
        foreignKey: "student_id",
        as: "student",
      });
      Studentattendance.belongsTo(models.Classschedule, {
        foreignKey: "classschedule_id",
        as: "schedule",
      });
      Studentattendance.belongsTo(models.User, {
        foreignKey: "marked_by",
        as: "marker",
      });
    }
  }

  Studentattendance.init(
    {
      student_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: "Students", key: "id" },
        onUpdate: "CASCADE",
        onDelete: "RESTRICT",
      },
      classschedule_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: "Classschedules", key: "id" },
        onUpdate: "CASCADE",
        onDelete: "RESTRICT",
      },
      attendance_date: { type: DataTypes.DATEONLY, allowNull: false },
      attendance_status: {
        type: DataTypes.ENUM("present", "permission", "sick", "absent"),
        allowNull: false,
      },
      marked_by: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: "Users", key: "id" },
        onUpdate: "CASCADE",
        onDelete: "RESTRICT",
      },
    },
    {
      sequelize,
      modelName: "Studentattendance",
      indexes: [
        {
          unique: true,
          fields: ["student_id", "classschedule_id", "attendance_date"],
          name: "student_attendance_schedule_date_unique",
        },
      ],
    },
  );

  return Studentattendance;
};
