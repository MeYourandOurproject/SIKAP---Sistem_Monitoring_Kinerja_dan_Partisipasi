"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Classroom extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Classroom.hasMany(models.Classschedule, { foreignKey: 'classroom_id' });
    }
  }
  Classroom.init(
    {
      classroom_name: { type: DataTypes.STRING, allowNull: false },
      classroom_type: {
        type: DataTypes.ENUM,
        values: ["theory", "lab"],
        allowNull: false,
      },
      classroom_status: {
        type: DataTypes.ENUM,
        values: ["available", "occupied"],
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "Classroom",
    },
  );
  return Classroom;
};
