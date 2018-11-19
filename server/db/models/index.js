const User = require('./user')

const Recipe = require('./recipe')
const Ingredient = require('./ingredient')
const Equipment = require('./equipment')
const Tag = require('./tag')
const Preference = require('./preference')
const Requirement = require('./requirement')

//Preference relationships
User.hasMany(Preference)
Preference.belongsTo(User, {foreignKey: {allowNull: false}})
// Preference.belongsTo(Recipe)
Preference.belongsTo(Tag)
Preference.belongsTo(Ingredient)

//Requirement relationships
User.hasMany(Requirement)
Requirement.belongsTo(User, {foreignKey: {allowNull: false}})
// Requirement.belongsTo(Recipe)
Requirement.belongsTo(Tag)
Requirement.belongsTo(Ingredient)

// //Tag to Recipe relationship
Recipe.belongsToMany(Tag, {through: 'RecipeTags'})
Tag.belongsToMany(Recipe, {through: 'RecipeTags'})

// //Ingredient to Recipe relationship
Recipe.belongsToMany(Ingredient, {through: 'RecipeIngredients'})
Ingredient.belongsToMany(Recipe, {through: 'RecipeIngredients'})

// //Equipment to Recipe relationship
Equipment.belongsToMany(Recipe, {through: 'RecipeEquipment'})
Recipe.belongsToMany(Equipment, {through: 'RecipeEquipment'})

module.exports = {
  User,
  //Recipe
  Ingredient,
  Equipment,
  Tag,
  Preference,
  Requirement
}
