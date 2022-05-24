// Reference models
const Users = require("./Users");
const Files = require("./Files");
const Types = require("./Types");
const Categories = require("./Categories");
const Favourites = require("./Favourites");
const Reviews = require("./Reviews");
const Downloads = require("./Downloads");
const { BelongsTo } = require("sequelize/types");

// Define relationships between tables
// Users in the guise of creator
Users.hasMany(Files, {
  foreignKey: "user_id",
  onDelete: "NOACTION",
});

Files.belongsTo(Users, {
  foreignKey: "user_id",
  onDelete: "NOACTION",
});

Users.hasMany(Downloads, {
  foreignKey: "user_id",
  onDelete: "NOACTION",
});

Downloads.belongsTo(Users, {
  foreignKey: "user_id",
  onDelete: "NOACTION",
});

Users.hasMany(Favourites, {
  foreignKey: "user_id",
  onDelete: "NOACTION",
});

Favourites.belongsTo(Users, {
  foreignKey: "user_id",
  onDelete: "NOACTION",
});

Users.hasMany(Reviews, {
  foreignKey: "user_id",
  onDelete: "NOACTION",
});

Reviews.belongsTo(Users, {
  foreignKey: "user_id",
  onDelete: "NOACTION",
});

File.hasMany(Downloads, {
  foreignKey: "file_id",
  onDelete: "NOACTION",
});

Downloads.belongsTo(Files, {
  foreignKey: "file_id",
  onDelete: "NOACTION",
});

File.hasMany(Favourites, {
  foreignKey: "file_id",
  onDelete: "NOACTION",
});

Favourites.belongsTo(Files, {
  foreignKey: "file_id",
  onDelete: "NOACTION",
});

File.hasMany(Reviews, {
  foreignKey: "file_id",
  onDelete: "NOACTION",
});

Reviews.belongsTo(Files, {
  foreignKey: "file_id",
  onDelete: "NOACTION",
});

// Below still to be defined properly as many to many through intermediate file
Files.hasMany(Types, {
  foreignKey: "type_id",
  onDelete: "NOACTION",
});

Types.hasMany(Files, {
  foreignKey: "type_id",
  onDelete: "NOACTION",
});

Files.hasMany(Categories, {
  foreignKey: "category_id",
  onDelete: "NOACTION",
});

Categories.hasMany(Files, {
  foreignKey: "category_id",
  onDelete: "NOACTION",
});

// Still to determine which way deletes should go in terms of cascade