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
    const uId = req.user.id
    if (uId) {
      const recommendations = recommend(uId).map(rec => rec.recipeId)
      const recipes = await Recipe.findIds(recommendations)
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
