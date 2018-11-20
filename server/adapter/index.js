const adapters = {
  YUMMLY: require('./yummly-adapter')
}

const RecipeFactory = (recipe, source) => {
  const adapter = adapters[source]
  return adapter(recipe)
}

module.exports = RecipeFactory
