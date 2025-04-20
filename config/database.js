// Import Sequelize and load environment variables
const { Sequelize } = require('sequelize');
require('dotenv').config();

// Create a Sequelize instance
const sequelize = new Sequelize({
  dialect: process.env.DB_DIALECT || 'sqlite',  
  storage: './recipe.sqlite',                   
  logging: false                                
});

// Export the Sequelize connection
module.exports = sequelize;
