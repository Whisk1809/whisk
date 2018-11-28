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
  Requirement,
  Preference
} = require('../server/db/models')

const RecipeFactory = require('../server/adapter')
const yummlyData = require('../server/adapter/yummly-data.json')
const users = require('./seed-helper/user-generator.js')

async function seed(done) {
  await db.sync({force: true}).then(Recipe.addFullTextIndex)
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
      phone: '+13364136015'
    }),
    User.create({
      email: 'murphy@email.com',
      password: '123',
      name: 'murphy',
      phone: '+1111-111-1111'
    })
  ])

  const cody = someUsers[0]

  const mostUsers = await Promise.all(users.map(user => User.create(user)))

  const allUsers = [...someUsers, ...mostUsers]

  // for the recipe that was just created, if it fits a certain criteria,
  // assign it to a different group of profiles to yield distinct clusters of preferences
  // Like Italian
  // Like Kid-Friendly, dislike Asian
  // Like American
  // Like Asian, dislike American
  const len = allUsers.length
  const partitionSize = Math.floor(len / 4)
  const group1 = allUsers.slice(0, partitionSize)
  const group2 = allUsers.slice(1 * partitionSize, 2 * partitionSize)
  const group3 = allUsers.slice(2 * partitionSize, 3 * partitionSize)
  const group4 = allUsers.slice(3 * partitionSize)

  const adaptedData = yummlyData.map(sourceRecipe =>
    RecipeFactory(sourceRecipe, 'YUMMLY')
  )
  //these vars will be used to help us split trending and popular
  let j = 0
  let createdAt = '9-1-2018'
  for (let i = 0; i < adaptedData.length; i++) {
    const [recipe, categories, ingredients] = adaptedData[i]
    if (!recipe.prepTimeSeconds) continue //don't want to add to db if we don't have preptime
    const [newRecipe, created] = await Recipe.findOrCreate({
      where: {title: recipe.title}
    })
    if (!created) continue //skip if this is a name duplicate
    await newRecipe.update(recipe)
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

    await Promise.all(
      newIngredients.map(ingredient => newRecipe.setIngredients(ingredient[0]))
    )
    await Promise.all(
      newCategories.map(category => newRecipe.setCategories(category[0]))
    )

    // obviously need to refactor this if time allows
    // find the users who meet that criteria and create a preference for that user based on a distribution
    if (categories.map(e => e.name).includes('Italian')) {
      const likers = group1.filter(() => j % 3 === 0)
      for (let i = 0; i < likers.length; i++) {
        try {
          await Preference.create({
            userId: likers[i].id,
            recipeId: newRecipe.id,
            prefers: true,
            createdAt
          })
          j++

          if (j === 200) createdAt = '11-26-2018'
        } catch (err) {
          console.error(err)
        }
      }
    }
    if (categories.map(e => e.name).includes('American')) {
      const likers = group3.filter(() => j % 3 === 0)
      const dislikers = group4.filter(() => j % 3 === 0)
      for (let i = 0; i < likers.length; i++) {
        try {
          await Preference.create({
            userId: likers[i].id,
            recipeId: newRecipe.id,
            prefers: true,
            createdAt
          })

          j++
          if (j === 200) createdAt = '11-26-2018'
        } catch (err) {
          console.error(err)
        }
      }
      for (let i = 0; i < dislikers.length; i++) {
        try {
          await Preference.create({
            userId: dislikers[i].id,
            recipeId: newRecipe.id,
            prefers: false,
            createdAt
          })

          j++
          if (j === 200) createdAt = '11-26-2018'
        } catch (err) {
          console.error(err)
        }
      }
    }
    if (categories.map(e => e.name).includes('Asian')) {
      const likers = group4.filter(() => j % 3 === 0)
      const dislikers = group2.filter(() => j % 3 === 0)
      for (let i = 0; i < likers.length; i++) {
        try {
          await Preference.create({
            userId: likers[i].id,
            recipeId: newRecipe.id,
            prefers: true,
            createdAt
          })

          j++
          if (j === 200) createdAt = '11-26-2018'
        } catch (err) {
          console.error(err)
        }
      }
      for (let i = 0; i < dislikers.length; i++) {
        try {
          await Preference.create({
            userId: dislikers[i].id,
            recipeId: newRecipe.id,
            prefers: false,
            createdAt
          })

          j++
          if (j === 200) createdAt = '11-26-2018'
        } catch (err) {
          console.error(err)
        }
      }
    }

    if (categories.map(e => e.name).includes('Kid-Friendly')) {
      const likers = group2.filter(() => j % 3 === 0)
      for (let i = 0; i < likers.length; i++) {
        try {
          await Preference.create({
            userId: likers[i].id,
            recipeId: newRecipe.id,
            prefers: true,
            createdAt
          })

          j++
          if (j === 200) createdAt = '11-26-2018'
        } catch (err) {
          console.error(err)
        }
      }
    }
  }

  //adds some favorites and requirements for cody for the demo
  await Promise.all([
    cody.setRecipes([3, 34, 56]),
    Requirement.create({
      userId: 1,
      ingredientId: 1,
      requires: false
    }),
    Requirement.create({
      userId: 1,
      ingredientId: 4,
      requires: false
    }),
    Requirement.create({
      userId: 1,
      ingredientId: 29,
      requires: false
    })
  ])

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
