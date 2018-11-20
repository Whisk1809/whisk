const Sequelize = require('sequelize')
const db = require('../db')

const Category = db.define('category', {
  name: {
    type: Sequelize.STRING,
    validate: {notEmpty: true},
    allowNull: false
  }
})

//

module.exports = Category
