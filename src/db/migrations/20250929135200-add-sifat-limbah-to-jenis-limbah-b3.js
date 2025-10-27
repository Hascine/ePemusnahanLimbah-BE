'use strict';

/** @type {import('node-pg-migrate').MigrationBuilder} */
exports.up = async (pgm) => {
  pgm.addColumn('jenis_limbah_b3', {
    sifat_limbah: { type: 'text' },
  });
};

/** @type {import('node-pg-migrate').MigrationBuilder} */
exports.down = async (pgm) => {
  pgm.dropColumn('jenis_limbah_b3', 'sifat_limbah');
};
