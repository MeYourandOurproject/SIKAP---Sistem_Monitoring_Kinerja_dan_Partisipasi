"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Teacherassignment extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Teacherassignment.belongsTo(models.Activity, {
        foreignKey: 'activity_id',
        onDelete: 'CASCADE',
      });
      Teacherassignment.belongsTo(models.Teacher, { foreignKey: 'teacher_id' });
    }
  }
  Teacherassignment.init(
    {
      activity_id: {
        type: DataTypes.INTEGER,
        references: {
          model: "Activities",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
        allowNull: false,
      },
      teacher_id: {
        type: DataTypes.INTEGER,
        references: {
          model: "Teachers",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "RESTRICT",
        allowNull: false,
      },
      academic_year: { type: DataTypes.STRING(9), allowNull: false },
      semester: { type: DataTypes.ENUM("odd", "even") },
      day_of_week: {
        type: DataTypes.ENUM(
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday"
        ),
        allowNull: true
      },
      session: {
        type: DataTypes.ENUM("morning", "afternoon", "all_day"),
        allowNull: true
      },
    },
    {
      sequelize,
      modelName: "Teacherassignment",
    },
  );
  return Teacherassignment;
};
