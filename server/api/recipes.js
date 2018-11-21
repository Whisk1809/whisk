const router = require('express').Router()
const {Recipe} = require('../db/models')
const {recommend} = require('../db/graphDb')
module.exports = router

router.get('/', async (req, res, next) => {
  try {
    const recipes = await Recipe.findAll()
    res.json(recipes)
  } catch (err) {
    console.error(err)
    next(err)
  }
})

router.get('/trending', async (req, res, next) => {
  try {
    const trendingRecipes = await Recipe.getTrending()
    res.json(trendingRecipes)
  } catch (err) {
    console.error(err)
    next(err)
  }
})
router.get('/:recipeId', async (req, res, next) => {
  try {
    const recipeId = req.params.recipeId
    console.log('-----------------single recipe BEFORE')
    const singleRecipe = await Recipe.findById(recipeId)
    console.log('-----------------single recipe', singleRecipe)
    res.json(singleRecipe)
  } catch (err) {
    console.error(err)
    next(err)
  }
})
