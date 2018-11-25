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
router.get('/recommended', async (req, res, next) => {
  try {
    if (req.user) {
      const uId = req.user.id
      const recipes = await Recipe.recommend(uId)
      res.json(recipes)
    } else {
      const noUser = new Error('cannot give a recommendation without a user id')
      next(noUser)
    }
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
router.get('/popular', async (req, res, next) => {
  try {
    const popularRecipes = await Recipe.getPopular()
    res.json(popularRecipes)
  } catch (err) {
    console.error(err)
    next(err)
  }
})
router.get('/new', async (req, res, next) => {
  try {
    const uId = req.user.id
    if (uId) {
      const newRecipes = await Recipe.getNew(uId)
      res.json(newRecipes)
    } else {
      const err = new Error('A user must be logged in to be given new recipes')
      next(err)
    }
  } catch (err) {
    console.error(err)
    next(err)
  }
})

router.get('/:recipeId', async (req, res, next) => {
  try {
    const recipeId = req.params.recipeId
    const singleRecipe = await Recipe.findById(recipeId)
    res.json(singleRecipe)
  } catch (err) {
    console.error(err)
    next(err)
  }
})
