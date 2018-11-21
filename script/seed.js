'use strict'

const db = require('../server/db')
const {
  graphDb,
  deleteGraph,
  createConstraints
} = require('../server/db/graphDb')
const {
  User,
  Recipe,
  Category,
  Ingredient,
  Preference,
  Requirement
} = require('../server/db/models')
// const recipes = require('./epicurious-recipes')
const RecipeFactory = require('../server/adapter')
const yummlyData = require('../server/adapter/yummly-data.json')
const users = require('./seed-helper/user-generator.js')

async function seed(done) {
  await db.sync({force: true})
  console.log('db synced!')
  await deleteGraph()
  console.log('graph db cleared!')
  await createConstraints()
  console.log('created constraints for graph db')

  const someUsers = await Promise.all([
    User.create({
      email: 'cody@email.com',
      password: '123',
      name: 'cody',
      phone: '111-111-1111'
    }),
    User.create({
      email: 'murphy@email.com',
      password: '123',
      name: 'murphy',
      phone: '111-111-1111'
    })
  ])

  const mostUsers = await Promise.all(users.map(user => User.create(user)))

  const allUsers = [...someUsers, ...mostUsers]

  const adaptedData = yummlyData.map(sourceRecipe =>
    RecipeFactory(sourceRecipe, 'YUMMLY')
  )
  for (let i = 0; i < adaptedData.length; i++) {
    const [recipe, categories, ingredients] = adaptedData[i]
    const newCategories = await Promise.all(
      categories.map(category =>
        Category.findOrCreate({where: {name: category.name}})
      )
    )

    const newIngredients = await Promise.all(
      ingredients.map(ingredient =>
        Ingredient.findOrCreate({where: {name: ingredient.name}})
      )
    )
    const newRecipe = await Recipe.create(recipe)
    await Promise.all(
      newIngredients.map(ingredient => newRecipe.setIngredients(ingredient[0]))
    )
    await Promise.all(
      newCategories.map(category => newRecipe.setCategories(category[0]))
    )

    // for the recipe that was just created, if it fits a certain criteria,
    // assign it to a different group of profiles
    // Like Italian, dislike American
    // Like Kid-Friendly, dislike Asian
    // Like Barbecue, like American
    // Like Asian, dislike American

    const len = allUsers.length
    const partitionSize = Math.floor(len / 4)
    const group1 = [0, 1 * partitionSize]
    const group2 = [1 * partitionSize, 2 * partitionSize]
    const group3 = [2 * partitionSize, 3 * partitionSize]
    const group4 = [3 * partitionSize]
    // obviously need to refactor this if time allows
    // find the users who meet that criteria (or anti-criteria) and create a preference for that user based on a distribution
    if (categories.map(e => e.name).includes('Italian')) {
      const likers = allUsers.slice(...group1).filter(() => Math.random() > 0.8)
      await Promise.all(
        likers.map(user =>
          Preference.create({
            userId: user.id,
            recipeId: newRecipe.id,
            prefers: true
          })
        )
      )
    }
    if (categories.map(e => e.name).includes('American')) {
      const likers = allUsers.slice(...group3).filter(() => Math.random() > 0.8)
      const dislikers = allUsers
        .slice(...group1)
        .filter(() => Math.random() > 0.8)
      await Promise.all(
        likers.map(user =>
          Preference.create({
            userId: user.id,
            recipeId: newRecipe.id,
            prefers: true
          })
        )
      )
      await Promise.all(
        dislikers.map(user =>
          Preference.create({
            userId: user.id,
            recipeId: newRecipe.id,
            prefers: false
          })
        )
      )
    }
    if (categories.map(e => e.name).includes('Barbecue')) {
      const likers = allUsers.slice(...group3).filter(() => Math.random() > 0.8)
      await Promise.all(
        likers.map(user =>
          Preference.create({
            userId: user.id,
            recipeId: newRecipe.id,
            prefers: true
          })
        )
      )
    }
    if (categories.map(e => e.name).includes('Asian')) {
      const likers = allUsers.slice(...group4).filter(() => Math.random() > 0.8)
      const dislikers = allUsers
        .slice(...group2)
        .filter(() => Math.random() > 0.8)
      await Promise.all(
        likers.map(user =>
          Preference.create({
            userId: user.id,
            recipeId: newRecipe.id,
            prefers: true
          })
        )
      )
      await Promise.all(
        dislikers.map(user =>
          Preference.create({
            userId: user.id,
            recipeId: newRecipe.id,
            prefers: false
          })
        )
      )
    }
    if (categories.map(e => e.name).includes('Kid-Friendly')) {
      const likers = allUsers.slice(...group2).filter(() => Math.random() > 0.8)
      await Promise.all(
        likers.map(user =>
          Preference.create({
            userId: user.id,
            recipeId: newRecipe.id,
            prefers: true
          })
        )
      )
    }
  }

  // console.log(`seeded ${users.length} users`)
  console.log(
    `seeded ${
      adaptedData.length
    } recipes and their associated categories/ingredients`
  )
  console.log(`seeded successfully`)
  db.close()
  graphDb.close()
  if (done) done()
}

// We've separated the `seed` function from the `runSeed` function.
// This way we can isolate the error handling and exit trapping.
// The `seed` function is concerned only with modifying the database.
async function runSeed() {
  console.log('seeding...')
  try {
    await seed()
  } catch (err) {
    console.error(err)
    process.exitCode = 1
  } finally {
    console.log('closing db connection')
    await db.close()
    console.log('db connection closed')
    await graphDb.close()
    console.log('graph db connection closed')
  }
}

// Execute the `seed` function, IF we ran this module directly (`node seed`).
// `Async` functions always return a promise, so we can use `catch` to handle
// any errors that might occur inside of `seed`.
if (module === require.main) {
  runSeed()
}

// we export the seed function for testing purposes (see `./seed.spec.js`)
module.exports = seed
