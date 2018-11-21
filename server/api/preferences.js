const router = require('express').Router()
const {Preference} = require('../db/models')

router.post('/', async (req, res, next) => {
  try {
    const userId = req.user.id
    const recipeId = req.recipe.id ? req.recipe.id : null
    const categoryId = req.category.id ? req.category.id : null
    const ingredientId = req.ingredient.id ? req.ingredient.id : null
    const prefers = req.prefers ? req.prefers : null

    let data = {
      userId,
      recipeId,
      prefers,
      categoryId,
      ingredientId
    }
    const newPreference = await Preference.create(data)
    res.status(200).send(newPreference)
  } catch (err) {
    next(err)
  }
})

module.exports = router
