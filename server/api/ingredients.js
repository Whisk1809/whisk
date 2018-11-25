const router = require('express').Router()
const {Ingredient} = require('../db/models')
module.exports = router

router.get('/', async (req, res, next) => {
  try {
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
router.get('/:id', async (req, res, next) => {
  try {
    const ingredient = await Ingredient.findById(req.params.id)
    res.json(ingredient)
  } catch (err) {
    console.error(err)
  }
})
