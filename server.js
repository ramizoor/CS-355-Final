const express = require('express');
const session = require('express-session');
const exphbs = require('express-handlebars');
const SequelizeStore = require('connect-session-sequelize')(session.Store);
const path = require('path');
require('dotenv').config();

// Sequelize models and connection
const { sequelize } = require('./models');
const { Category } = require('./models'); 

// Route handlers
const authRoutes = require('./routes/authRoutes');
const recipeRoutes = require('./routes/recipeRoutes');
const userRoutes = require('./routes/userRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// Session setup for login state
const sess = {
  secret: process.env.SESSION_SECRET || 'supersecret',
  resave: false,
  saveUninitialized: true,
  store: new SequelizeStore({ db: sequelize }),
};
app.use(session(sess));

// Flash message middleware
app.use((req, res, next) => {
  res.locals.success = req.session.success || null;
  res.locals.error = req.session.error || null;
  delete req.session.success;
  delete req.session.error;
  next();
});

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Handlebars
const hbs = exphbs.create({
  helpers: {
    eq: (a, b) => a === b,
    newline: (text) => {
      return text.replace(/\r?\n/g, '<br>');
    }
  }
});

app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');

// Routes
app.use('/', authRoutes);
app.use('/recipes', recipeRoutes);
app.use('/users', userRoutes);

// Start the app after DB sync + seed categories
sequelize.sync().then(async () => {
  const count = await Category.count();
  if (count === 0) {
    await Category.bulkCreate([
      { name: 'Breakfast' },
      { name: 'Lunch' },
      { name: 'Dinner' },
      { name: 'Snack' },
      { name: 'Dessert' }
    ]);
    console.log('🌱 Default categories added');
  }

  app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
});
