const router = require('express').Router()
const {Preference} = require('../db/models')

router.post('/', async (req, res, next) => {
  try {
    const userId = req.user.id
    const recipeId = req.body.recipeId ? req.body.recipeId : null
    // const categoryId = req.body.category.id ? req.body.category.id : null
    // const ingredientId = req.body.ingredient.id ? req.body.ingredient.id : null

    let prefers
    if (req.body.prefers !== undefined) {
      prefers = req.body.prefers
    }  else {
      prefers = null
    }

    let data = {
      userId,
      recipeId,
      prefers,
      // categoryId,
      // ingredientId
    }

    const newPreference = await Preference.create(data)
    res.status(200).send(newPreference)
  } catch (err) {
    next(err)
  }
})

module.exports = router
