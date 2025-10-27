module.exports = (sequelize, DataTypes) => {
    const SigningHistory = sequelize.define('SigningHistory', {
      history_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      berita_acara_id: { type: DataTypes.INTEGER, allowNull: false },
      step_id: { type: DataTypes.INTEGER, allowNull: false },
      signed_at: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
      signer_id: { type: DataTypes.TEXT, allowNull: false },
      signer_id_delegated: DataTypes.TEXT,
      signer_name: DataTypes.TEXT,
      signer_jabatan: DataTypes.TEXT,
      signer_dept_id: DataTypes.TEXT,
      signer_job_level_id: DataTypes.TEXT,
      signer_name_delegated: DataTypes.TEXT,
      signer_jabatan_delegated: DataTypes.TEXT,
      signer_dept_id_delegated: DataTypes.TEXT,
      signer_job_level_id_delegated: DataTypes.TEXT,
    }, {
      tableName: 'signing_history',
      timestamps: false,
    });
  
    SigningHistory.associate = (models) => {
      SigningHistory.belongsTo(models.BeritaAcara, { foreignKey: 'berita_acara_id' });
      SigningHistory.belongsTo(models.SigningWorkflowStep, { foreignKey: 'step_id' });
    };
  
    return SigningHistory;
  };