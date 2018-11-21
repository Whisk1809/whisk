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

const RecipeFactory = require('../server/adapter')
const yummlyData = require('../server/adapter/yummly-data.json')

async function seed(done) {
  await db.sync({force: true})
  console.log('db synced!')
  await deleteGraph()
  console.log('graph db cleared!')
  await createConstraints()
  console.log('created constraints for graph db')

  const users = await Promise.all([
    User.create({email: 'cody@email.com', password: '123'}),
    User.create({email: 'murphy@email.com', password: '123'})
  ])
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
  }

  console.log(`seeded ${users.length} users`)
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
