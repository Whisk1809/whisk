const Sequelize = require('sequelize')
const db = require('../db')

const Recipe = db.define('recipe', {
  title: {
    type: Sequelize.STRING,
    validate: {notEmpty: true},
    allowNull: false
  },
  description: {
    type: Sequelize.STRING,
    allowNull: true
  },
  prepTime: {
    type: Sequelize.STRING
  },

  imageUrl: {
    type: Sequelize.STRING,
    defaultValue: 'default-recipe.jpg'
  },
  directions: {
    type: Sequelize.ARRAY(Sequelize.TEXT),
    validate: {
      notEmpty: true
    },
    allowNull: false
  }
})

module.exports = Recipe
