const router = require('express').Router()
const {Recipe} = require('../db/models')
module.exports = router

router.get("/", async (req, res, next) => {
  try {
    const recipes = await Recipe.findAll()
    res.json(recipes)
  } catch (err) {
    console.error(err)
    next(err)
  }
})
