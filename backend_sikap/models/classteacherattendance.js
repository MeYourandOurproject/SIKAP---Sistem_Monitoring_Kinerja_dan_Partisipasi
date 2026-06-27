"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Classteacherattendance extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Classteacherattendance.belongsTo(models.Classschedule, {
        foreignKey: "classschedule_id",
        as: "schedule",
      });

      Classteacherattendance.belongsTo(models.User, {
        foreignKey: "validator_id",
        as: "validator",
      });
    }
  }
  Classteacherattendance.init(
    {
      date: DataTypes.DATE,
      classschedule_id: DataTypes.INTEGER,
      attendance_status: DataTypes.ENUM("present", "permission", "absent"),
      activity_status: DataTypes.ENUM("teaching", "empty", "assignment"),
      validator_id: DataTypes.INTEGER,
      validated_at: DataTypes.DATE,
      lateness: DataTypes.INTEGER,
      notes: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Classteacherattendance",
    },
  );
  return Classteacherattendance;
};
