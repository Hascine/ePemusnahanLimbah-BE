module.exports = (sequelize, DataTypes) => {
  const JenisLimbahB3 = sequelize.define('JenisLimbahB3', {
    type_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    nama: { type: DataTypes.TEXT, allowNull: false, unique: true },
    sifat_limbah: { type: DataTypes.TEXT, allowNull: true },
  }, {
    tableName: 'jenis_limbah_b3',
    timestamps: false,
  });

  JenisLimbahB3.associate = (models) => {
    JenisLimbahB3.hasMany(models.PermohonanPemusnahanLimbah, { foreignKey: 'jenis_limbah_b3_id' });
  };

  return JenisLimbahB3;
};