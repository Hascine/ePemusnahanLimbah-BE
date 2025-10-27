module.exports = (sequelize, DataTypes) => {
  const BeritaAcara = sequelize.define('BeritaAcara', {
    berita_acara_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    bagian: { type: DataTypes.TEXT, allowNull: false },
    tanggal: { type: DataTypes.DATE, allowNull: false },
    waktu: { type: DataTypes.DATE, allowNull: false },
    lokasi_verifikasi: { type: DataTypes.TEXT, allowNull: false },
    pelaksana_bagian: DataTypes.TEXT,
    supervisor_bagian: DataTypes.TEXT,
    pelaksana_hse: DataTypes.TEXT,
    supervisor_hse: DataTypes.TEXT,
    creator_id: { type: DataTypes.TEXT, allowNull: false },
    creator_id_delegated: DataTypes.TEXT,
    signing_workflow_id: { type: DataTypes.INTEGER, allowNull: false },
    current_signing_step_id: DataTypes.INTEGER,
    status: { 
      type: DataTypes.ENUM('Draft', 'InProgress', 'Completed', 'Rejected'), 
      allowNull: false, 
      defaultValue: 'Draft' 
    },
    creator_name: DataTypes.TEXT,
    creator_jabatan: DataTypes.TEXT,
    creator_dept_id: DataTypes.TEXT,
    creator_job_level_id: DataTypes.TEXT,
    creator_name_delegated: DataTypes.TEXT,
    creator_jabatan_delegated: DataTypes.TEXT,
    creator_dept_id_delegated: DataTypes.TEXT,
    creator_job_level_id_delegated: DataTypes.TEXT,
  }, {
    tableName: 'berita_acara',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: false,
  });

  BeritaAcara.associate = (models) => {
    BeritaAcara.hasMany(models.PermohonanPemusnahanLimbah, { foreignKey: 'berita_acara_id' });
    BeritaAcara.hasMany(models.SigningHistory, { foreignKey: 'berita_acara_id' });
    BeritaAcara.belongsTo(models.SigningWorkflow, { foreignKey: 'signing_workflow_id' });
    BeritaAcara.belongsTo(models.SigningWorkflowStep, { foreignKey: 'current_signing_step_id' });
  };

  return BeritaAcara;
};