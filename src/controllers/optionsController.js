const { GolonganLimbah, JenisLimbahB3 } = require('../models');

/**
 * Helper function to parse the waste code and type from the nama field.
 * This is the same function used in labelController for consistency.
 */
const parseJenisLimbah = (nama) => {
    if (nama === 'Lain-lain') {
        return { kode_limbah: 'Lain-lain', jenis_limbah: 'Lain-lain' };
    }
    
    const parts = nama.split(' ');
    if (parts.length > 1) {
        const kode_limbah = parts[0];
        const jenis_limbah = parts.slice(1).join(' ');
        return { kode_limbah, jenis_limbah };
    }
    
    // Fallback if there is no space
    return { kode_limbah: nama, jenis_limbah: nama };
};

// GET /options/golongan-limbah
const getGolonganLimbah = async (req, res) => {
  try {
    const golongan = await GolonganLimbah.findAll({ order: [['nama', 'ASC']] });
    res.status(200).json({
      success: true,
      data: golongan
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: "Error fetching Golongan Limbah options", 
      error: error.message 
    });
  }
};

// GET /options/jenis-limbah-b3
const getJenisLimbahB3 = async (req, res) => {
  try {
    const jenis = await JenisLimbahB3.findAll({ order: [['nama', 'ASC']] });
    
    // Parse each jenis limbah to separate kode and jenis
    const parsedJenis = jenis.map(item => {
      const parsed = parseJenisLimbah(item.nama);
      return {
        type_id: item.type_id,
        nama: item.nama,
        kode_limbah: parsed.kode_limbah,
        jenis_limbah: parsed.jenis_limbah,
        sifat_limbah: item.sifat_limbah || null
      };
    });
    
    res.status(200).json({
      success: true,
      data: parsedJenis
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: "Error fetching Jenis Limbah B3 options", 
      error: error.message 
    });
  }
};

module.exports = {
  getGolonganLimbah,
  getJenisLimbahB3,
};