module.exports = (sequelize, DataTypes) => {
    const SigningWorkflow = sequelize.define('SigningWorkflow', {
      signing_workflow_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      workflow_name: { type: DataTypes.TEXT, allowNull: false },
      is_active: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
    }, {
      tableName: 'signing_workflows',
      timestamps: false,
    });
  
    SigningWorkflow.associate = (models) => {
      SigningWorkflow.hasMany(models.SigningWorkflowStep, { foreignKey: 'signing_workflow_id' });
      SigningWorkflow.hasMany(models.BeritaAcara, { foreignKey: 'signing_workflow_id' });
    };
  
    return SigningWorkflow;
  };