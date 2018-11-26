
const router = require('express').Router()
const {Ingredient} = require('../db/models')

router.get('/', async (req, res, next) => {
  try {
    const ids = req.query.ids
    if (ids) {
      const idsArr = ids.split(',')
      const ingredients = await Ingredient.findAll({where: {id: idsArr}})
      res.json(ingredients)
    } else {
      const ingredients = await Ingredient.findAll()
      res.json(ingredients)
    }
  } catch (err) {
    console.error(err)
    next(err)
  }
})

module.exports = router
