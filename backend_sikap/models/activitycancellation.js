"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Activitycancellation extends Model {
    static associate(models) {
      Activitycancellation.belongsTo(models.Activity, {
        foreignKey: "activity_id",
        onDelete: "CASCADE",
      });
    }
  }

  Activitycancellation.init(
    {
      activity_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: "Activities", key: "id" },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      date: { type: DataTypes.DATEONLY, allowNull: false },
      session: {
        type: DataTypes.ENUM("morning", "afternoon", "all_day"),
        allowNull: false,
      },
      reason: { type: DataTypes.TEXT, allowNull: false },
      cancelled_by: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: "Users", key: "id" },
        onUpdate: "CASCADE",
        onDelete: "RESTRICT",
      },
    },
    {
      sequelize,
      modelName: "Activitycancellation",
      indexes: [
        {
          unique: true,
          fields: ["activity_id", "date", "session"],
          name: "activity_cancellations_schedule_unique",
        },
      ],
    },
  );

  return Activitycancellation;
};
