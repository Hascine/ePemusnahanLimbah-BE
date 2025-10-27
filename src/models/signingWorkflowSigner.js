module.exports = (sequelize, DataTypes) => {
    const SigningWorkflowSigner = sequelize.define('SigningWorkflowSigner', {
      signer_config_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      step_id: { type: DataTypes.INTEGER, allowNull: false },
      log_nik: { type: DataTypes.TEXT, allowNull: false },
      peran: { type: DataTypes.TEXT, allowNull: false },
    }, {
      tableName: 'signing_workflow_signers',
      timestamps: false,
    });
  
    SigningWorkflowSigner.associate = (models) => {
      SigningWorkflowSigner.belongsTo(models.SigningWorkflowStep, { foreignKey: 'step_id' });
    };
  
    return SigningWorkflowSigner;
  };