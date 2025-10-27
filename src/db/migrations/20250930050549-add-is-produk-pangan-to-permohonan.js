'use strict';

/** @type {import('node-pg-migrate').MigrationBuilder} */
exports.up = async (pgm) => {
  pgm.addColumn('permohonan_pemusnahan_limbah', {
    is_produk_pangan: { 
      type: 'boolean', 
      notNull: true, 
      default: false 
    },
  });
};

/** @type {import('node-pg-migrate').MigrationBuilder} */
exports.down = async (pgm) => {
  pgm.dropColumn('permohonan_pemusnahan_limbah', 'is_produk_pangan');
};