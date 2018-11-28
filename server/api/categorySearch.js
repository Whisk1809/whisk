const router = require('express').Router()
const {Category} = require('../db/models')

module.exports = router

router.get('/', async (req, res, next) => {
  try {
    const categories = await Category.findAll({
      where: {
        name: {
          $iLike: req.query.findCategory + '%'
        }
      }
    })
    res.json(categories)
  } catch (err) {
    console.error(err)
    next(err)
  }
})
