const router = require('express').Router()
const {Ingredient} = require('../db/models')
module.exports = router

router.get('/', async (req, res, next) => {
  try {
    console.log('fasdfasdfas', req.query)
    const ingredients = await Ingredient.findAll({
      where: {
        name: {
          $iLike: req.query.findIngredient + '%'
        }
      }
    })
    res.json(ingredients)
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
