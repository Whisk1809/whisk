const Sequelize = require('sequelize')
const db = require('../db')

const Category = db.define('category', {
  name: {
    type: Sequelize.STRING,
    validate: {notEmpty: true},
    allowNull: false
  },
  image: {
    type: Sequelize.STRING,
    allowNull: true,
    defaultValue:
      'https://capitoltheatre.com/wp-content/uploads/2017/03/placeholder3.svg'
  }
})

//

module.exports = Category
