const router = require('express').Router()
module.exports = router

router.use('/users', require('./users'))
router.use('/recipes', require('./recipes'))
router.use('/categories', require('./categories'))
router.use('/requirements', require('./requirements'))
router.use('/ingredients', require('./ingredients'))

router.use('/twilio', require('./twilio'))
router.use('/preferences', require('./preferences'))
router.use('/favorites', require('./favorites'))

router.use('/ingredientSearch', require('./ingredientSearch'))

router.use((req, res, next) => {
  const error = new Error('Not Found')
  error.status = 404
  next(error)
})
