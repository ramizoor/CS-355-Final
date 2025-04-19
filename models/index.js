const sequelize = require('../config/database');

const User = require('./User');
const Recipe = require('./Recipe');
const Ingredient = require('./Ingredient');
const Category = require('./Category');
const Comment = require('./Comment');
const Favorite = require('./Favorite');

// Associations
User.hasMany(Recipe);
Recipe.belongsTo(User);

Category.hasMany(Recipe);
Recipe.belongsTo(Category);

Recipe.hasMany(Ingredient);
Ingredient.belongsTo(Recipe);

User.hasMany(Comment);
Recipe.hasMany(Comment);
Comment.belongsTo(User);
Comment.belongsTo(Recipe);

User.hasMany(Favorite);
Favorite.belongsTo(User);

Recipe.hasMany(Favorite);
Favorite.belongsTo(Recipe);

module.exports = {
  sequelize,
  User,
  Recipe,
  Ingredient,
  Category,
  Comment,
  Favorite
};
