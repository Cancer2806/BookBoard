// Define required modules
const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');

// create Downloads Model (table) using Sequelize
class Downloads extends Model { }

// Define fields
Downloads.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    value: {
      type: DataTypes.DECIMAL(4,2),
      allowNull: true,
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
    modelName: 'downloads',
  }
);

module.exports = Downloads;