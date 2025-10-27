'use strict';

/** @type {import('node-pg-migrate').MigrationBuilder} */
exports.up = async (pgm) => {
  // Add submitted_at timestamp for tracking when a draft was submitted
  pgm.addColumn('permohonan_pemusnahan_limbah', {
    submitted_at: { type: 'timestamptz', notNull: false }
  });
};

/** @type {import('node-pg-migrate').MigrationBuilder} */
exports.down = async (pgm) => {
  pgm.dropColumn('permohonan_pemusnahan_limbah', 'submitted_at');
};
