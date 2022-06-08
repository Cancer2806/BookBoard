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
    'g77wfa22jgvmo0op',
    'tnp8q5x7dj1epcqg',
    'k5yv9no8wokvto7x',
    {
      host: 'eyvqcfxf5reja3nv.cbetxkdyhwsb.us-east-1.rds.amazonaws.com',
      dialect: 'mysql',
      port: 3306
    }
  );
}

module.exports = sequelize;
