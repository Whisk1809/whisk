const router = require('express').Router()
const {Preference} = require('../db/models')

router.post('/', async (req, res, next) => {
  try {
    const userId = req.user.id
    const recipeId = req.body.recipeId ? req.body.recipeId : null
    // const categoryId = req.body.category.id ? req.body.category.id : null
    // const ingredientId = req.body.ingredient.id ? req.body.ingredient.id : null
    const prefers = req.body.prefers ? req.body.prefers : null

    let data = {
      userId,
      recipeId,
      prefers,
      // categoryId,
      // ingredientId
    }
    const newPreference = await Preference.findOrcreate(data)
    res.status(200).send(newPreference)
  } catch (err) {
    next(err)
  }
})

module.exports = router
