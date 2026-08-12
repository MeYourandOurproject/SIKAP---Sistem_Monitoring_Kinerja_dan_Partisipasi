'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Activity extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Activity.hasMany(models.Teacherassignment, {
        foreignKey: 'activity_id',
        onDelete: 'CASCADE',
        hooks: true,
      });
      Activity.hasMany(models.Activitysession, {
        foreignKey: 'activity_id',
        onDelete: 'CASCADE',
        hooks: true,
      });
    }
  }
  Activity.init({
    name: { type: DataTypes.STRING },
    type: { type: DataTypes.ENUM("routine", "tentative") },
    date: { type: DataTypes.DATEONLY, allowNull: true },
    responsiblePerson: { type: DataTypes.STRING, allowNull: true },
    description: { type: DataTypes.STRING },
    status: {
      type: DataTypes.ENUM("planned", "ongoing", "completed", "cancelled"),
      allowNull: false,
      defaultValue: "planned",
    },
    target_type: {
      type: DataTypes.ENUM('all_teachers', 'assigned_teachers'),
      allowNull: false,
      defaultValue: 'all_teachers',
    },
  }, {
    sequelize,
    modelName: 'Activity',
  });
  return Activity;
};