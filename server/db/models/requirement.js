const Sequelize = require('sequelize')
const db = require('../db')

const Requirement = db.define('requirement', {
  requires: {
    type: Sequelize.BOOLEAN,
    allowNull: false
  }
})

module.exports = Requirement
