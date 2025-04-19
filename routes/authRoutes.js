const express = require('express');
const router = express.Router();
const { register, login, logout } = require('../controllers/authController');

// Redirect / to /recipes
router.get('/', (req, res) => {
  res.redirect('/recipes');
});

// Login form
router.get('/login', (req, res) => {
  res.render('login');
});

// Registration form
router.get('/register', (req, res) => {
  res.render('register');
});

// Handle registration
router.post('/register', register);

// Handle login
router.post('/login', login);

// Logout route
router.get('/logout', logout);

module.exports = router;
