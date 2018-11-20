const router = require('express').Router()
const {Requirement} = require('../db/models')
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

router.post('/:typeId/:id', async (req, res, next) => {
  try {
    const requireBool = req._body
    const addedRequirement = await Requirement.create({
      requires: requireBool,
      userId: req.user.dataValues.id,
      [req.params.typeId]: req.params.id
    })
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
