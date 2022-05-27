// Define required modules
const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');

// create Categories Model (table) using Sequelize
class Categories extends Model { }

// Define fields
// Scifi, fantasy, tech geek stories, mystery, etc.
Categories.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    category_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    category_description: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },{
  sequelize,
  timestamps: true,
  freezeTableName: true,
  underscored: true,
  modelName: 'categories',
  }
);

module.exports = Categories;