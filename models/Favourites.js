// Define required modules
const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');

// create Favourites Model (table) using Sequelize
class Favourites extends Model { }

// Define fields.
Favourites.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    rating: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id',
      },
    },
    file_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'files',
        key: 'id',
      },
    },
    sequelize,
    timestamps: true,
    freezeTableName: true,
    underscored: true,
    modelName: 'favourites',
  }
);

module.exports = Favourites;