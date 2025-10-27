const { Sequelize } = require('sequelize');

// Directly use the DATABASE_URL from your .env file
const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'postgres',
  protocol: 'postgres',
  logging: false,
  dialectOptions: {
    // Add SSL options for production if needed
    // ssl: {
    //   require: true,
    //   rejectUnauthorized: false
    // }
  },
  // Force Sequelize to store timestamps using Jakarta timezone (UTC+7)
  // This ensures createdAt/updatedAt and other timestamps are written with +07:00 offset.
  timezone: '+07:00'
});

module.exports = sequelize;