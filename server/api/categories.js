const router = require('express').Router()
const {Category, User} = require('../db/models')

router.get('/', async (req, res, next) => {
  try {
    const ids = req.query.ids
    if (ids) {
      const idsArr = ids.split(',')
      const categories = await Category.findAll({where: {id: idsArr}})
      res.json(categories)
    } else {
      const categories = await Category.findAll()
      res.json(categories)
    }
  } catch (err) {
    console.error(err)
    next(err)
  }
})

router.delete('/:categoryId', async (req, res, next) => {
  try {
    const userId = req.user.id
    const categoryId = req.params.categoryId

    const categoryToRemove = await Category.findById(categoryId)
    const user = await User.findById(userId)
    await user.categoryToRemove(categoryToRemove);
    res.sendStatus(204);
  } catch (err) {
    console.error(err)
    next(err)
  }
})

module.exports = router
