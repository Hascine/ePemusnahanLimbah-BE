module.exports = (sequelize, DataTypes) => {
  const GolonganLimbah = sequelize.define('GolonganLimbah', {
    category_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    nama: { type: DataTypes.TEXT, allowNull: false, unique: true },
  }, {
    tableName: 'golongan_limbah',
    timestamps: false,
  });

  GolonganLimbah.associate = (models) => {
    GolonganLimbah.hasMany(models.PermohonanPemusnahanLimbah, { foreignKey: 'golongan_limbah_id' });
  };

  return GolonganLimbah;
};