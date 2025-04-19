// sync.js
const { sequelize } = require('./models');

sequelize.sync({ force: true }).then(() => {
  console.log('Database synced!');
  process.exit();
});
