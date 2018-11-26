const Sequelize = require('sequelize')
const db = require('../db')

const Requirement = db.define('requirement', {
  requires: {
    type: Sequelize.BOOLEAN,
    allowNull: false
  },
  ingredientName: {
    type: Sequelize.STRING
  }
})

module.exports = Requirement
