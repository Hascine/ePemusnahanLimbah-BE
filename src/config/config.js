const path = require('path');

// Make sure dotenv is loaded to read the .env file
require('dotenv').config({ path: path.resolve(__dirname, '..', '..', '..', '.env') });

module.exports = {
  development: {
    // This is the key change. It forces Sequelize to use the DATABASE_URL.
    use_env_variable: "DATABASE_URL",
    dialect: 'postgres',
  },
  test: {
    use_env_variable: "DATABASE_URL",
    dialect: 'postgres',
  },
  production: {
    use_env_variable: 'DATABASE_URL',
    dialect: 'postgres',
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false
      }
    }
  }
};