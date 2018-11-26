const router = require('express').Router()
const {Requirement, Ingredient} = require('../db/models')
module.exports = router

router.get('/', async (req, res, next) => {
  try {
    const requirements = await Requirement.findAll()
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
      let updatedRequirement = await Requirement.update(
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
      updatedRequirement = await Requirement.findAll({
        where: {
          ingredientId: req.params.id,
          userId: req.user.dataValues.id
        }
      })
      addedRequirement = updatedRequirement[0]
    }

    res.status(201).json(addedRequirement)
  } catch (err) {
    console.error(err)
    next(err)
  }
})
router.delete('/:id', async (req, res, next) => {
  try {
    const deletedRequirement = await Requirement.destroy({
      where: {
        ingredientId: req.params.id,
        userId: req.user.dataValues.id
      }
    })
    res.json(deletedRequirement)
  } catch (err) {
    console.error(err)
    next(err)
  }
})
