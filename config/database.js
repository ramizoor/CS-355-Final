const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize({
  dialect: process.env.DB_DIALECT || 'sqlite',
  storage: './recipe.sqlite', // this will be your SQLite DB file
  logging: false
});

module.exports = sequelize;
