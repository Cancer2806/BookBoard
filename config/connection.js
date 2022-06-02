// Use sequelize as the ORM for managing the database
const Sequelize = require('sequelize');
// Use dotenv to substitute environment variables for security purposes
require('dotenv').config();

let sequelize;

// Configure database connection
if (process.env.JAWSDB_URL) {
  sequelize = new Sequelize(process.env.JAWSDB_URL);
} else {
  sequelize = new Sequelize(
    'sql6497220',
    'sql6497220',
   '9LyClKyRiB',
    {
      host: 'sql6.freemysqlhosting.net',
      dialect: 'mysql',
      port: 3306
    }
  );
}

module.exports = sequelize;
