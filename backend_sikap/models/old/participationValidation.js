'use strict';
module.exports = (sequelize, DataTypes) => {
  const ParticipationValidation = sequelize.define('ParticipationValidation', {
    activityId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    teacherId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    validatorId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    participationStatus: {
      type: DataTypes.ENUM('present', 'absent', 'excused', 'late', 'active', 'passive'),
      allowNull: false,
    },
    note: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    validatedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  }, {
    tableName: 'ParticipationValidations',
  });

  ParticipationValidation.associate = function(models) {
    ParticipationValidation.belongsTo(models.SchoolActivity, { foreignKey: 'activityId' });
    ParticipationValidation.belongsTo(models.Teacher, { foreignKey: 'teacherId' });
    ParticipationValidation.belongsTo(models.User, { foreignKey: 'validatorId' });
  };

  return ParticipationValidation;
};
