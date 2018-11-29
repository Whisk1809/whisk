const router = require('express').Router()
const {Preference} = require('../db/models')

//PLEASE NOTE: actions in this route is not fully restful. If necessary we can go back and try to make it restful. Although this way we might be able to avoid having to use normalizr in state shapes.

router.post('/', async (req, res, next) => {
  try {
    const userId = req.user.id
    const recipeId = req.body.recipeId ? req.body.recipeId : null
    // const categoryId = req.body.category.id ? req.body.category.id : null
    // const ingredientId = req.body.ingredient.id ? req.body.ingredient.id : null

    let prefers
    if (req.body.prefers !== undefined) {
      prefers = req.body.prefers
    } else {
      prefers = null
    }

    let data = {
      userId,
      recipeId,
      prefers
      // categoryId,
      // ingredientId
    }

    const existingPreference = await Preference.findOne({
      where: {userId, recipeId}
    })
    if (existingPreference) {
      if (existingPreference.prefers !== prefers) {
        await existingPreference.update({prefers})
        res.status(200).send(existingPreference)
      } else {
        res.sendStatus(409)
      }
    } else {
      const newPreference = await Preference.create(data)
      res.status(201).send(newPreference)
    }
  } catch (err) {
    next(err)
  }
})

router.get('/', async (req, res, next) => {
  if (!req.user) {
    const err = new Error('no user')
    next(err)
  } else {
    const userId = req.user.id
    try {
      const preferences = await Preference.findAll({where: {userId}})
      res.json(preferences)
    } catch (err) {
      next(err)
    }
  }
})

module.exports = router
