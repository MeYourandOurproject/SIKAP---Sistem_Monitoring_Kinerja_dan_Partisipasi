"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Teacher extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Teacher.hasMany(models.Class, { foreignKey: 'classteacher_id' });
      Teacher.hasMany(models.Classschedule, { foreignKey: 'teacher_id' });
      Teacher.hasMany(models.Classteacherattendance, { foreignKey: 'teacher_id' });
    }
  }
  Teacher.init(
    {
      name: { type: DataTypes.STRING, allowNull: false },
      nip: { type: DataTypes.STRING, unique: true, allowNull: true },
      nuptk: { type: DataTypes.STRING, unique: true, allowNull: true },
      gender: {
        type: DataTypes.ENUM,
        values: ["Male", "Female"],
        allowNull: false,
      },
      ptk_type: { type: DataTypes.STRING, allowNull: true},
      gtk_type: { type: DataTypes.STRING, allowNull: true},
      status: {
        type: DataTypes.ENUM,
        values: ["active", "inactive"],
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "Teacher",
    },
  );
  return Teacher;
};
