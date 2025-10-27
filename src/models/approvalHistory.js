module.exports = (sequelize, DataTypes) => {
  const ApprovalHistory = sequelize.define('ApprovalHistory', {
    history_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    request_id: { type: DataTypes.INTEGER, allowNull: false },
    step_id: { type: DataTypes.INTEGER, allowNull: false },
    decision_date: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
    status: { type: DataTypes.ENUM('Approved', 'Rejected'), allowNull: false },
    comments: DataTypes.TEXT,
    approver_id: { type: DataTypes.TEXT, allowNull: false },
    approver_id_delegated: DataTypes.TEXT,
    approver_name: DataTypes.TEXT,
    approver_jabatan: DataTypes.TEXT,
    approver_dept_id: DataTypes.TEXT,
    approver_job_level_id: DataTypes.TEXT,
    approver_name_delegated: DataTypes.TEXT,
    approver_jabatan_delegated: DataTypes.TEXT,
    approver_dept_id_delegated: DataTypes.TEXT,
    approver_job_level_id_delegated: DataTypes.TEXT,
  }, {
    tableName: 'approval_history',
    timestamps: false,
  });

  ApprovalHistory.associate = (models) => {
    ApprovalHistory.belongsTo(models.PermohonanPemusnahanLimbah, { foreignKey: 'request_id' });
    ApprovalHistory.belongsTo(models.ApprovalWorkflowStep, { foreignKey: 'step_id' });
  };

  return ApprovalHistory;
};