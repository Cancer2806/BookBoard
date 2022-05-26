// Define required modules
const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');

// create Types Model (table) using Sequelize
class Types extends Model { }

// Define fields
// magazine, zine, comic book, short story, etc.
Types.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    type_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    type_description: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    timestamps: true,
    freezeTableName: true,
    underscored: true,
    modelName: 'types',
  }
);

module.exports = Types;