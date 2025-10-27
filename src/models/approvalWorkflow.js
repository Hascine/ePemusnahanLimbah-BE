module.exports = (sequelize, DataTypes) => {
  const ApprovalWorkflow = sequelize.define('ApprovalWorkflow', {
    approval_workflow_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    workflow_name: { type: DataTypes.TEXT, allowNull: false },
    is_active: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
  }, {
    tableName: 'approval_workflows',
    timestamps: false,
  });

  ApprovalWorkflow.associate = (models) => {
    ApprovalWorkflow.hasMany(models.ApprovalWorkflowStep, { foreignKey: 'approval_workflow_id' });
    ApprovalWorkflow.hasMany(models.PermohonanPemusnahanLimbah, { foreignKey: 'approval_workflow_id' });
  };

  return ApprovalWorkflow;
};