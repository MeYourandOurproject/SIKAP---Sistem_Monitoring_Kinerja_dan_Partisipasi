'use strict';
module.exports = (sequelize, DataTypes) => {
  const AuditLog = sequelize.define('AuditLog', {
    action: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    entity: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    entityId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    performedBy: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  }, {
    tableName: 'AuditLogs',
  });

  AuditLog.associate = function(models) {
    AuditLog.belongsTo(models.User, { foreignKey: 'performedBy' });
  };

  return AuditLog;
};
