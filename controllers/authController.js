// Import the User model
const { User } = require('../models');

module.exports = {
  // Handle user registration
  register: async (req, res) => {
    try {
      const { name, email, password } = req.body;
      const user = await User.create({ name, email, password }); // create user
      req.session.userId = user.id; // log user in
      res.redirect('/');
    } catch (err) {
      res.status(500).send('Error registering user');
    }
  },

  // Handle user login
  login: async (req, res) => {
    try {
      const { email, password } = req.body;
      const user = await User.findOne({ where: { email } }); // find user by email

      // Check password or fail
      if (!user || !user.checkPassword(password)) {
        return res.status(401).send('Invalid credentials');
      }
      // log user in
      req.session.userId = user.id; 
      res.redirect('/');
    } catch (err) {
      res.status(500).send('Error logging in');
    }
  },

  // Handle user logout
  logout: (req, res) => {
    req.session.destroy(() => {
      res.redirect('/login');
    });
  }
};
