const router = require('express').Router()
const {User, Preference} = require('../db/models')
module.exports = router

router.get('/', async (req, res, next) => {
  try {
    const users = await User.findAll({
      // explicitly select only the id and email fields - even though
      // users' passwords are encrypted, it won't help if we just
      // send everything to anyone who asks!
      attributes: ['id', 'email']
    })
    res.json(users)
  } catch (err) {
    next(err)
  }
})
router.put('/', async (req, res, next) => {
  try {
    console.log('body here', req.body)
    const updatedUser = await User.update(
      {
        name: req.body.name,
        email: req.body.email,
        phone: req.body.phone
      },
      {
        where: {
          id: req.user.dataValues.id
        }
      }
    )
    res.json(updatedUser)
  } catch (err) {
    console.error(err)
    next(err)
  }
})
