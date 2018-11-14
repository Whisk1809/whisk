const db = require('../db')

const Equipment = db.define('equipment', {
  name: {
    type: Sequelize.STRING,
    validate: {notEmpty: true},
    allowNull: false
  },
})

//

module.exports = Equipment