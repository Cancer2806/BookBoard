// Define required modules
const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');

// create Files Model (table) using Sequelize
class Files extends Model { }

// Define fields
Files.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    price: {
      type: DataTypes.DECIMAL(4,2),
      allowNull: true,
    },
    // holds details of where to find file
    source_file: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    // holds the cover art image
    cover_art: {
      type: DataTypes.BLOB,
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
    type_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'types',
        key: 'id',
      },
    },
    category_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'categories',
        key: 'id',
      },
    },
    sequelize,
    timestamps: true,
    freezeTableName: true,
    underscored: true,
    modelName: 'files',
  }
);

module.exports = Files;