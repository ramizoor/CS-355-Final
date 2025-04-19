const express = require('express');
const router = express.Router();
const { Recipe, Category, Ingredient, User, Comment, Favorite } = require('../models');

// GET homepage
router.get('/', async (req, res) => {
  try {
    const recipes = await Recipe.findAll({
      include: [Category, User]
    });
    res.render('home', {
      recipes: recipes.map(r => r.get({ plain: true })),
      logged_in: !!req.session.userId
    });
  } catch (err) {
    res.status(500).send('Error loading recipes');
  }
});

// GET create recipe form
router.get('/create', async (req, res) => {
  if (!req.session.userId) return res.redirect('/login');

  const categories = await Category.findAll();
  res.render('createRecipe', {
    categories: categories.map(c => c.get({ plain: true }))
  });
});

// POST create new recipe
router.post('/create', async (req, res) => {
  try {
    const { title, description, instructions, categoryId, ingredients } = req.body;

    const recipe = await Recipe.create({
      title,
      description,
      instructions,
      categoryId,
      userId: req.session.userId
    });

    if (Array.isArray(ingredients)) {
      for (const name of ingredients) {
        await Ingredient.create({ name, recipeId: recipe.id });
      }
    }

    res.redirect('/');
  } catch (err) {
    res.status(500).send('Error creating recipe');
  }
});

// GET single recipe detail
router.get('/:id', async (req, res) => {
  try {
    const recipe = await Recipe.findByPk(req.params.id, {
      include: [
        Category,
        User,
        { model: Ingredient },
        {
          model: Comment,
          include: [User]
        }
      ]
    });

    if (!recipe) return res.status(404).send('Recipe not found');

    res.render('recipe', {
      recipe: recipe.get({ plain: true }),
      logged_in: !!req.session.userId,
      session: { userId: req.session.userId }
    });
  } catch (err) {
    res.status(500).send('Error loading recipe');
  }
});

// POST comment
router.post('/:id/comments', async (req, res) => {
  try {
    if (!req.session.userId) return res.redirect('/login');

    const { content } = req.body;
    await Comment.create({
      content,
      userId: req.session.userId,
      recipeId: req.params.id
    });

    res.redirect(`/recipes/${req.params.id}`);
  } catch (err) {
    res.status(500).send('Error posting comment');
  }
});

// POST favorite
router.post('/:id/favorite', async (req, res) => {
  try {
    if (!req.session.userId) return res.redirect('/login');

    const exists = await Favorite.findOne({
      where: {
        userId: req.session.userId,
        recipeId: req.params.id
      }
    });

    if (!exists) {
      await Favorite.create({
        userId: req.session.userId,
        recipeId: req.params.id
      });
    }

    res.redirect(`/recipes/${req.params.id}`);
  } catch (err) {
    res.status(500).send('Error favoriting recipe');
  }
});

// GET edit form
router.get('/:id/edit', async (req, res) => {
  const recipe = await Recipe.findByPk(req.params.id, {
    include: [Ingredient, Category]
  });

  if (!recipe || recipe.userId !== req.session.userId) {
    return res.status(403).send('Not allowed');
  }

  const categories = await Category.findAll();

  res.render('editRecipe', {
    recipe: recipe.get({ plain: true }),
    categories: categories.map(c => c.get({ plain: true }))
  });
});

// POST update recipe
router.post('/:id/edit', async (req, res) => {
  try {
    const { title, description, instructions, categoryId, ingredients } = req.body;

    const recipe = await Recipe.findByPk(req.params.id);

    if (recipe.userId !== req.session.userId) {
      return res.status(403).send('Not allowed');
    }

    await recipe.update({ title, description, instructions, categoryId });

    await Ingredient.destroy({ where: { recipeId: recipe.id } });
    if (Array.isArray(ingredients)) {
      for (const name of ingredients) {
        await Ingredient.create({ name, recipeId: recipe.id });
      }
    }

    res.redirect(`/recipes/${recipe.id}`);
  } catch (err) {
    res.status(500).send('Error updating recipe');
  }
});

// POST delete recipe
router.post('/:id/delete', async (req, res) => {
  try {
    const recipe = await Recipe.findByPk(req.params.id);
    if (!recipe || recipe.userId !== req.session.userId) {
      return res.status(403).send('Not allowed');
    }

    await recipe.destroy();
    res.redirect('/');
  } catch (err) {
    res.status(500).send('Error deleting recipe');
  }
});

module.exports = router;
