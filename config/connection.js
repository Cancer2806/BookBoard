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
    'reabav2yttistiag',
    'g9nfntt6j96cjgfr',
    'qz39d5cpjwwiua8r',
    {
      host: 'ebh2y8tqym512wqs.cbetxkdyhwsb.us-east-1.rds.amazonaws.com',
      dialect: 'mysql',
      port: 3306
    }
  );
}

module.exports = sequelize;
