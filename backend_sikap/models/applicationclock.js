"use strict";

const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Applicationclock extends Model {}

  Applicationclock.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: false,
      },
      mode: {
        type: DataTypes.ENUM("realtime", "simulation"),
        allowNull: false,
        defaultValue: "realtime",
      },
      simulated_at: {
        type: DataTypes.DATE,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: "Applicationclock",
      tableName: "ApplicationClocks",
    },
  );

  return Applicationclock;
};
