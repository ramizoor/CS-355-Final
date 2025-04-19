const express = require('express');
const router = express.Router();
const { User, Recipe, Favorite } = require('../models');

// Show user profile
router.get('/profile', async (req, res) => {
  if (!req.session.userId) {
    return res.redirect('/login');
  }

  try {
    const user = await User.findByPk(req.session.userId, {
      include: [
        { model: Recipe },
        { model: Favorite, include: ['recipe'] }
      ]
    });

    res.render('profile', {
      user: user.get({ plain: true }),
      logged_in: true
    });
  } catch (err) {
    res.status(500).send('Error loading profile');
  }
});

module.exports = router;
