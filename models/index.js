// Reference models
const Users = require("./Users");
const Files = require("./Files");
const Types = require("./Types");
const Categories = require("./Categories");
const Favourites = require("./Favourites");
const Reviews = require("./Reviews");
const Downloads = require("./Downloads");


// Define relationships between tables
// Users in the guise of creator
Users.hasMany(Files, {
  foreignKey: "user_id",
  onDelete: "NO ACTION",
});

Files.belongsTo(Users, {
  foreignKey: "user_id",
  onDelete: "NO ACTION",
});

Users.hasMany(Downloads, {
  foreignKey: "user_id",
  onDelete: "NO ACTION",
});

Downloads.belongsTo(Users, {
  foreignKey: "user_id",
  onDelete: "NO ACTION",
});

Users.hasMany(Favourites, {
  foreignKey: "user_id",
  onDelete: "NO ACTION",
});

Favourites.belongsTo(Users, {
  foreignKey: "user_id",
  onDelete: "NO ACTION",
});

Users.hasMany(Reviews, {
  foreignKey: "user_id",
  onDelete: "NO ACTION",
});

Reviews.belongsTo(Users, {
  foreignKey: "user_id",
  onDelete: "NO ACTION",
});

Files.hasMany(Downloads, {
  foreignKey: "file_id",
  onDelete: "NO ACTION",
});

Downloads.belongsTo(Files, {
  foreignKey: "file_id",
  onDelete: "NO ACTION",
});

Files.hasMany(Favourites, {
  foreignKey: "file_id",
  onDelete: "NO ACTION",
});

Favourites.belongsTo(Files, {
  foreignKey: "file_id",
  onDelete: "NO ACTION",
});

Files.hasMany(Reviews, {
  foreignKey: "file_id",
  onDelete: "NO ACTION",
});

Reviews.belongsTo(Files, {
  foreignKey: "file_id",
  onDelete: "NO ACTION",
});

Types.hasMany(Files, {
  foreignKey: "type_id",
  onDelete: "NO ACTION",
});

Files.belongsTo(Types, {
  foreignKey: "type_id",
  onDelete: "NO ACTION",
});

Categories.hasMany(Files, {
  foreignKey: "category_id",
  onDelete: "NO ACTION",
});

Files.belongsTo(Categories, {
  foreignKey: "category_id",
  onDelete: "NO ACTION",
});

module.exports = { Categories, Downloads, Favourites, Files, Reviews, Types, Users };