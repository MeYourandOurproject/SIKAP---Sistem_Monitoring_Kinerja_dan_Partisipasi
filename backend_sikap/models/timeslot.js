"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Timeslot extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Timeslot.init(
    {
      schema: { type: DataTypes.STRING, allowNull: false },
      jp: { type: DataTypes.STRING, allowNull: false },
      start: { type: DataTypes.TIME, allowNull: false },
      end: { type: DataTypes.TIME, allowNull: false },
    },
    {
      sequelize,
      modelName: "Timeslot",
    },
  );
  return Timeslot;
};
