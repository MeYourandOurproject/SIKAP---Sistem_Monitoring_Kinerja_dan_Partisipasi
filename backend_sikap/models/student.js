"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Student extends Model {
    static associate(models) {
      Student.belongsTo(models.Class, { foreignKey: "class_id", as: "class" });
      Student.hasMany(models.Studentattendance, {
        foreignKey: "student_id",
        as: "attendances",
      });
    }
  }

  Student.init(
    {
      nis: { type: DataTypes.STRING(20), allowNull: true, unique: true },
      nisn: { type: DataTypes.STRING(20), allowNull: true, unique: true },
      name: { type: DataTypes.STRING, allowNull: false },
      gender: {
        type: DataTypes.ENUM("Male", "Female"),
        allowNull: true,
      },
      class_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: "Classes", key: "id" },
        onUpdate: "CASCADE",
        onDelete: "RESTRICT",
      },
      status: {
        type: DataTypes.ENUM("active", "inactive"),
        allowNull: false,
        defaultValue: "active",
      },
    },
    {
      sequelize,
      modelName: "Student",
      indexes: [{ fields: ["class_id", "status"], name: "students_class_status" }],
    },
  );

  return Student;
};
