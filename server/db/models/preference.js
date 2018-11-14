const Sequelize = require('sequelize')
const db = require('../db')

const Preference = db.define('preference', {
  prefers:{
    type: Sequelize.BOOLEAN,
    allowNull: false
  },

})

module.exports = Preference