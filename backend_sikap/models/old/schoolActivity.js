'use strict';
module.exports = (sequelize, DataTypes) => {
  const SchoolActivity = sequelize.define('SchoolActivity', {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    type: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    responsiblePerson: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM('planned', 'ongoing', 'completed', 'cancelled'),
      defaultValue: 'planned',
    },
  }, {
    tableName: 'SchoolActivities',
  });

  SchoolActivity.associate = function(models) {
    SchoolActivity.hasMany(models.ParticipationValidation, { foreignKey: 'activityId' });
  };

  return SchoolActivity;
};
