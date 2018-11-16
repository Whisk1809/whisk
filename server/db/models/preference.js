const Sequelize = require('sequelize')
const db = require('../db')
const {like, dislike} = require('../graphDb')

const Preference = db.define('preference', {
  prefers: {
    type: Sequelize.BOOLEAN,
    allowNull: false
  }
})

Preference.afterCreate(preference => {
  const {userId, recipeId, ingredientId, prefers} = preference
  const entityToPrefer = {entityId: 1, entity: 'Recipe'}
  if (prefers) {
    like(userId, entityToPrefer)
  } else {
    dislike(userId, entityToPrefer)
  }
})
Preference.afterUpdate()

module.exports = Preference
