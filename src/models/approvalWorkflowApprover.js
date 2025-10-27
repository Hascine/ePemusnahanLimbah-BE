module.exports = (sequelize, DataTypes) => {
  const ApprovalWorkflowApprover = sequelize.define('ApprovalWorkflowApprover', {
    approver_config_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    step_id: { type: DataTypes.INTEGER, allowNull: false },
    approver_id: { type: DataTypes.TEXT, allowNull: false },
    approver_name: DataTypes.TEXT,
    approver_cc: DataTypes.TEXT,
    approver_dept_id: DataTypes.TEXT,
    approver_identity: DataTypes.TEXT,
  }, {
    tableName: 'approval_workflow_approvers',
    timestamps: false,
  });

  ApprovalWorkflowApprover.associate = (models) => {
    ApprovalWorkflowApprover.belongsTo(models.ApprovalWorkflowStep, { foreignKey: 'step_id' });
  };

  return ApprovalWorkflowApprover;
};