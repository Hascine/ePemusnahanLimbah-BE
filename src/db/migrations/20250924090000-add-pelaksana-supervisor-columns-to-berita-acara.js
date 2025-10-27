'use strict';

/** @type {import('node-pg-migrate').MigrationBuilder} */
exports.up = async (pgm) => {
  pgm.addColumns('berita_acara', {
    pelaksana_bagian: { type: 'text' },
    supervisor_bagian: { type: 'text' },
    pelaksana_hse: { type: 'text' },
    supervisor_hse: { type: 'text' }
  });
};

/** @type {import('node-pg-migrate').MigrationBuilder} */
exports.down = async (pgm) => {
  pgm.dropColumns('berita_acara', [
    'pelaksana_bagian',
    'supervisor_bagian',
    'pelaksana_hse',
    'supervisor_hse'
  ]);
};
