// Import the Sequelize connection from models
const { sequelize } = require('./models');

// Sync the database and force it to reset
sequelize.sync({ force: true }).then(() => {
  console.log('Database synced!');
  process.exit(); 
});
