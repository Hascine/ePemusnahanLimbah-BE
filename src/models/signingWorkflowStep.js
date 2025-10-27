module.exports = (sequelize, DataTypes) => {
    const SigningWorkflowStep = sequelize.define('SigningWorkflowStep', {
      step_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      signing_workflow_id: { type: DataTypes.INTEGER, allowNull: false },
      step_level: { type: DataTypes.INTEGER, allowNull: false },
      step_name: { type: DataTypes.TEXT, allowNull: false },
      required_signatures: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 1 },
    }, {
      tableName: 'signing_workflow_steps',
      timestamps: false,
    });
  
    SigningWorkflowStep.associate = (models) => {
      SigningWorkflowStep.belongsTo(models.SigningWorkflow, { foreignKey: 'signing_workflow_id' });
      SigningWorkflowStep.hasMany(models.SigningWorkflowSigner, { foreignKey: 'step_id' });
      SigningWorkflowStep.hasMany(models.SigningHistory, { foreignKey: 'step_id' });
    };
  
    return SigningWorkflowStep;
  };