module.exports = (sequelize, DataTypes) => {
  const AuditLog = sequelize.define('AuditLog', {
    log_id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
    request_id: { type: DataTypes.INTEGER, allowNull: false },
    change_timestamp: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
    action_type: { type: DataTypes.ENUM('UPDATE', 'ADD_ITEM', 'REMOVE_ITEM'), allowNull: false },
    changer_id: { type: DataTypes.TEXT, allowNull: false },
    changer_id_delegated: DataTypes.TEXT,
    changer_name: DataTypes.TEXT,
    changer_jabatan: DataTypes.TEXT,
    changer_dept_id: DataTypes.TEXT,
    changer_job_level_id: DataTypes.TEXT,
    changer_name_delegated: DataTypes.TEXT,
    changer_jabatan_delegated: DataTypes.TEXT,
    changer_dept_id_delegated: DataTypes.TEXT,
    changer_job_level_id_delegated: DataTypes.TEXT,
    target_entity: DataTypes.TEXT,
    target_entity_id: DataTypes.TEXT,
    field_name: DataTypes.TEXT,
    old_value: DataTypes.TEXT,
    new_value: DataTypes.TEXT,
  }, {
    tableName: 'audit_log_permohonan_pemusnahan_limbah',
    timestamps: false,
  });

  AuditLog.associate = (models) => {
    AuditLog.belongsTo(models.PermohonanPemusnahanLimbah, { foreignKey: 'request_id' });
  };

  return AuditLog;
};