const Sequelize = require('sequelize')
const db = require('../db')

const Requirement = db.define('requirement', {
  prefers: {
    type: Sequelize.BOOLEAN,
    allowNull: false
  }
})

module.exports = Requirement
