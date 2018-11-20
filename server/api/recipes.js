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

router.get("/:recipeId", async (req, res, next) => {
  try {
    const recipeId = req.params.recipeId
    const singleRecipe = await Recipe.findById(recipeId)
    res.json(singleRecipe)
  } catch (err) {
    console.error(err)
    next(err)
  }
})
