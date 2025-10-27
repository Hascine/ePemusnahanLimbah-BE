'use strict';

/** @type {import('node-pg-migrate').MigrationBuilder} */
exports.up = async (pgm) => {
    pgm.addType('berita_acara_status_enum', ['Draft', 'InProgress', 'Completed', 'Rejected']);
    pgm.addColumn('berita_acara', {
        status: { 
            type: 'berita_acara_status_enum', 
            notNull: true, 
            default: 'Draft' 
        }
    });
};

/** @type {import('node-pg-migrate').MigrationBuilder} */
exports.down = async (pgm) => {
    pgm.dropColumn('berita_acara', 'status');
    pgm.dropType('berita_acara_status_enum');
};


