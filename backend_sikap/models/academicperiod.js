"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Academicperiod extends Model {}

  Academicperiod.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: false,
      },
      academic_year: {
        type: DataTypes.STRING(9),
        allowNull: false,
      },
      semester: {
        type: DataTypes.ENUM("odd", "even"),
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "Academicperiod",
      tableName: "AcademicPeriods",
    },
  );

  return Academicperiod;
};
