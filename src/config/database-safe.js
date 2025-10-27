const { Sequelize } = require("sequelize");

// Create a conditional Sequelize instance
let sequelize;

if (process.env.DATABASE_URL) {
  try {
    sequelize = new Sequelize(process.env.DATABASE_URL, {
      dialect: "postgres",
      protocol: "postgres",
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
      timezone: "+07:00",
    });
  } catch (error) {
    console.warn("Database connection failed, running without database:", error.message);
    sequelize = null;
  }
} else {
  console.warn("DATABASE_URL not provided, running without database");
  sequelize = null;
}

module.exports = sequelize;
