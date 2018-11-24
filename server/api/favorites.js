const router = require('express').Router()
const {Recipe, User} = require('../db/models')

router.post('/', async (req, res, next) => {
  try {
    const userId = req.user.id
    const recipeId = req.body.recipe.id
    const recipeToAdd = Recipe.findById(recipeId)
    const user = User.findById(userId)
    const favoriteRecipe = await user.addRecipe(recipeToAdd)
    res.json(favoriteRecipe)
  } catch (err) {
    console.error(err)
    next(err)
  }
})

module.exports = router
