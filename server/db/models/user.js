const crypto = require('crypto')
const Sequelize = require('sequelize')
const db = require('../db')
const {
  Recipe,
  Preference,
  Requirement,
  Ingredient,
  Category
} = require('../models')

const User = db.define('user', {
  name: {
    type: Sequelize.STRING,
    allowNull: false
  },

  email: {
    type: Sequelize.STRING,
    unique: true,
    allowNull: false
  },
  password: {
    type: Sequelize.STRING,
    // Making `.password` act like a func hides it when serializing to JSON.
    // This is a hack to get around Sequelize's lack of a "private" option.
    get() {
      return () => this.getDataValue('password')
    }
  },
  salt: {
    type: Sequelize.STRING,
    // Making `.salt` act like a function hides it when serializing to JSON.
    // This is a hack to get around Sequelize's lack of a "private" option.
    get() {
      return () => this.getDataValue('salt')
    }
  },
  googleId: {
    type: Sequelize.STRING
  },
  phone: {
    type: Sequelize.STRING,
    validate: {} //add regex validation and front end validation
  }
})

module.exports = User

/**
 * instanceMethods
 */
User.prototype.correctPassword = function(candidatePwd) {
  return User.encryptPassword(candidatePwd, this.salt()) === this.password()
}

/**
 * classMethods
 */

 User.findByPhoneNumber = number => {
   const user = User.findOne({
     where: {
       phone: number
     },
     include: [{model: Preference, include: [Ingredient, Category, Recipe]}]
   })
 }
 
User.findFavoriteRecipes = userId => {
  const user = User.findById(userId, {include: [Recipe]})
}

User.findRequirements = userId => {
  const user = User.findById(userId, {
    include: [{model: Requirement, include: [Ingredient, Category]}]
  })
}
User.findPreferences = userId => {
  const user = User.findById(userId, {
    include: [{model: Preference, include: [Ingredient, Category, Recipe]}]
  })
}

User.generateSalt = function() {
  return crypto.randomBytes(16).toString('base64')
}

User.encryptPassword = function(plainText, salt) {
  return crypto
    .createHash('RSA-SHA256')
    .update(plainText)
    .update(salt)
    .digest('hex')
}

/**
 * hooks
 */
const setSaltAndPassword = user => {
  if (user.changed('password')) {
    user.salt = User.generateSalt()
    user.password = User.encryptPassword(user.password(), user.salt())
  }
}

User.beforeCreate(setSaltAndPassword)
User.beforeUpdate(setSaltAndPassword)
