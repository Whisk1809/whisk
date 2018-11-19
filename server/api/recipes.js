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
    if (!uId) {
      const newErr = new Error('No user to recommend')
      res.next(newErr)
    }
    const recipeIds = await recommend(uId)
    const recipes = await Promise.all(
      recipeIds.map(recipe => Recipe.findById(recipe.recipeId))
    )
    res.json(recipes)
  } catch (err) {
    console.error(err)
    next(err)
  }
})
