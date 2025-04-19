const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/database');

class Recipe extends Model {}

Recipe.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  title: DataTypes.STRING,
  description: DataTypes.TEXT,
  instructions: DataTypes.TEXT
}, {
  sequelize,
  modelName: 'recipe'
});

module.exports = Recipe;
