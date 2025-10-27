module.exports = (sequelize, DataTypes) => {
  const ApprovalWorkflowStep = sequelize.define('ApprovalWorkflowStep', {
    step_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    approval_workflow_id: { type: DataTypes.INTEGER, allowNull: false },
    step_level: { type: DataTypes.INTEGER, allowNull: false },
    step_name: { type: DataTypes.TEXT, allowNull: false },
    required_approvals: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 1 },
  }, {
    tableName: 'approval_workflow_steps',
    timestamps: false,
  });

  ApprovalWorkflowStep.associate = (models) => {
    ApprovalWorkflowStep.belongsTo(models.ApprovalWorkflow, { foreignKey: 'approval_workflow_id' });
    ApprovalWorkflowStep.hasMany(models.ApprovalWorkflowApprover, { foreignKey: 'step_id' });
    ApprovalWorkflowStep.hasMany(models.ApprovalHistory, { foreignKey: 'step_id' });
    ApprovalWorkflowStep.hasMany(models.PermohonanPemusnahanLimbah, { as: 'CurrentRequests', foreignKey: 'current_step_id' });
  };

  return ApprovalWorkflowStep;
};