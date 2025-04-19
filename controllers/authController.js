const { User } = require('../models');

module.exports = {
  register: async (req, res) => {
    try {
      const { name, email, password } = req.body;
      const user = await User.create({ name, email, password });
      req.session.userId = user.id;
      res.redirect('/');
    } catch (err) {
      res.status(500).send('Error registering user');
    }
  },

  login: async (req, res) => {
    try {
      const { email, password } = req.body;
      const user = await User.findOne({ where: { email } });

      if (!user || !user.checkPassword(password)) {
        return res.status(401).send('Invalid credentials');
      }

      req.session.userId = user.id;
      res.redirect('/');
    } catch (err) {
      res.status(500).send('Error logging in');
    }
  },

  logout: (req, res) => {
    req.session.destroy(() => {
      res.redirect('/login');
    });
  }
};
