const router = require('express').Router()
const {Requirement, Ingredient} = require('../db/models')
module.exports = router

router.get('/', async (req, res, next) => {
  try {
    const requirements = await Requirement.findAll({
      // include: [
      //   {
      //     model: Ingredient
      //   }
      // ]
    })
    res.json(requirements)
  } catch (err) {
    console.error(err)
    next(err)
  }
})

router.post('/:id', async (req, res, next) => {
  try {
    const requireBool = Object.keys(req.body)[0]
    const ingredient = await Ingredient.findById(req.params.id)
    console.log('ingredient name here', ingredient.name)

    let addedRequirement
    const doesExist = await Requirement.findAll({
      where: {
        ingredientId: req.params.id,
        userId: req.user.dataValues.id
      }
    })

    if (!doesExist[0]) {
      addedRequirement = await Requirement.create({
        requires: requireBool,
        userId: req.user.dataValues.id,
        ingredientId: req.params.id,
        ingredientName: ingredient.name
      })
    } else {
      addedRequirement = await Requirement.update(
        {
          requires: requireBool,
          userId: req.user.dataValues.id,
          ingredientId: req.params.id,
          ingredientName: ingredient.name
        },
        {
          where: {
            ingredientId: req.params.id,
            userId: req.user.dataValues.id
          }
        }
      )
    }
    res.status(201).json(addedRequirement)
  } catch (err) {
    console.error(err)
    next(err)
  }
})
router.delete('/:requirementId', async (req, res, next) => {
  try {
    const deletedRequirement = await Requirement.destroy({
      where: {
        ingredientId: req.params.requirementId,
        userId: req.user.dataValues.id
      }
    })
    res.json(deletedRequirement)
  } catch (err) {
    console.error(err)
    next(err)
  }
})
