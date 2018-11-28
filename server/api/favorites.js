const router = require('express').Router()
const {Recipe, User} = require('../db/models')

router.get('/', async (req, res, next) => {
  try {
    const userId = req.user.id
    const user = await User.findById(userId)
    const favRecipes = await user.getRecipes()
    res.json(favRecipes)
  } catch (err) {
    console.error(err)
    next(err)
  }
})

router.post('/', async (req, res, next) => {
  try {
    const userId = req.user.id;
    const recipeId = req.body.recipeId;
    const recipeToAdd = await Recipe.findById(recipeId);
    const user = await User.findById(userId)
    const favoriteRecipe = await user.addRecipe(recipeToAdd)
    res.json(favoriteRecipe)
  } catch (err) {
    console.error(err)
    next(err)
  }
})

router.delete('/:recipeId', async (req, res, next) => {
  try {
    const userId = req.user.id
    const recipeId = req.params.recipeId

    const recipeToRemove = await Recipe.findById(recipeId)
    const user = await User.findById(userId)
    await user.removeRecipe(recipeToRemove);
    res.sendStatus(204);
  } catch (err) {
    console.error(err)
    next(err)
  }
})

module.exports = router
