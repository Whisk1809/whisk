const db = require('../db')
const Sequelize = require('sequelize')

const Equipment = db.define('equipment', {
  name: {
    type: Sequelize.STRING,
    validate: {notEmpty: true},
    allowNull: false
  }
})

//

module.exports = Equipment
