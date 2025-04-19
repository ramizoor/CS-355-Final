const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/database');

class Ingredient extends Model {}

Ingredient.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: DataTypes.STRING
}, {
  sequelize,
  modelName: 'ingredient'
});

module.exports = Ingredient;
