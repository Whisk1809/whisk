const Sequelize = require('sequelize')
const db = require('../db')

const Reminder = db.define('reminder', {
 name: Sequelize.STRING,
 phoneNumber: Sequelize.STRING,
 notification: Sequelize.INTEGER,
 timeZone: Sequelize.STRING,
 time: {
   type: Sequelize.DATE,
   index: true
 }
})

module.exports = Reminder
