const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/database');

class Favorite extends Model {}

// Define fields for Favorite
Favorite.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  }
}, {
  sequelize,
  modelName: 'favorite'
});

module.exports = Favorite;
