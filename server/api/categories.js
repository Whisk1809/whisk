
const router = require('express').Router()
const {Category} = require('../db/models')

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

module.exports = router
