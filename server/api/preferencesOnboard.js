const router = require('express').Router()
const {Preference, Ingredient, Category, Recipe} = require('../db/models')
module.exports = router

router.get('/', async (req, res, next) => {
  try {
    const preferences = await Preference.findAll({
      where: {
        userId: req.user.dataValues.id
      }
    })
    res.json(preferences)
  } catch (err) {
    console.error(err)
    next(err)
  }
})

router.post('/:id/:type', async (req, res, next) => {
  try {
    const requireBool = Object.keys(req.body)[0]
    let reference
    let referenceName
    let referenceKey
    if (req.params.type === 'ingredientId') {
      reference = await Ingredient.findById(req.params.id)
      referenceName = reference.name
      referenceKey = 'ingredientName'
    }
    if (req.params.type === 'categoryId') {
      reference = await Category.findById(req.params.id)
      referenceName = reference.name
      referenceKey = 'categoryName'
    }
    if (req.params.type === 'recipeId') {
      reference = await Recipe.findById(req.params.id)
      referenceName = reference.title
      referenceKey = 'recipeName'
    }
    console.log('herrrreee', referenceName)
    let addedPreference
    const doesExist = await Preference.findAll({
      where: {
        [req.params.type]: req.params.id,
        userId: req.user.dataValues.id
      }
    })

    if (!doesExist[0]) {
      addedPreference = await Preference.create({
        prefers: requireBool,
        userId: req.user.dataValues.id,
        [req.params.type]: req.params.id,
        [referenceKey]: referenceName
      })
    } else {
      let updatedPreference = await Preference.update(
        {
          prefers: requireBool,
          userId: req.user.dataValues.id,
          [req.params.type]: req.params.id,
          [referenceKey]: referenceName
        },
        {
          where: {
            [req.params.type]: req.params.id,
            userId: req.user.dataValues.id
          }
        }
      )
      updatedPreference = await Preference.findAll({
        where: {
          [req.params.type]: req.params.id,
          userId: req.user.dataValues.id
        }
      })
      addedPreference = updatedPreference[0]
    }

    res.status(201).json(addedPreference)
  } catch (err) {
    console.error(err)
    next(err)
  }
})
router.delete('/:id/:type', async (req, res, next) => {
  try {
    const deletedPreference = await Preference.destroy({
      where: {
        [req.params.type]: req.params.id,
        userId: req.user.dataValues.id
      }
    })
    res.json(deletedPreference)
  } catch (err) {
    console.error(err)
    next(err)
  }
})
