const db = require('../db')

const Ingredient = db.define('ingredient', {
  name: {
    type: Sequelize.STRING,
    validate: {notEmpty: true},
    allowNull: false
  },
})

//

module.exports = Ingredient