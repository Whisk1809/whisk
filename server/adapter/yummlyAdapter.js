//input recipe text and return an object consisting of data objects that conform to our db models

const sampleAll = queryAll('soup')

console.log(sampleAll)

module.exports = recipeText => {
  return {recipe, ingredients, categories, equipment}
}
