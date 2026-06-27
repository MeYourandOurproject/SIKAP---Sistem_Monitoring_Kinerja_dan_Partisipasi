"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Enrollment extends Model {
    static associate(models) {
      Enrollment.belongsTo(models.User, { foreignKey: "user_id" });
      Enrollment.belongsTo(models.Class, { foreignKey: "class_id" });
    }
  }
  Enrollment.init(
    {
      user_id: { type: DataTypes.INTEGER, allowNull: false },
      class_id: { type: DataTypes.INTEGER, allowNull: false },
    },
    {
      sequelize,
      modelName: "Enrollment",
    },
  );
  return Enrollment;
};
