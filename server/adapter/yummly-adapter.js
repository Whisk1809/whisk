const parseRecipe = sourceRecipe => {
  const {
    title,
    sourceId,
    source,
    ingredients,
    ingredientList,
    imageUrl,
    cuisine,
    course,
    holiday,
    prepTimeSeconds,
    prepTime,
    sourceRecipeUrl,
    numberOfServings
  } = sourceRecipe
  const intermediateCourse = course ? course : []
  const intermediateCuisine = cuisine ? cuisine : []
  const intermediateHoliday = holiday ? holiday : []
  const categories = [
    ...intermediateCourse,
    ...intermediateCuisine,
    ...intermediateHoliday
  ]

  const targetRecipe = {
      title,
      source,
      sourceId,
      ingredientList,
      prepTimeSeconds,
      prepTime,
      numberOfServings,
      sourceRecipeUrl,
      imageUrl
    },
    targetCategories = categories.map(category => ({
      name: category
    })),
    targetIngedients = ingredients.map(ingredient => ({name: ingredient}))
  console.log('target ingredients: ', targetIngedients)
  console.log('target categories: ', targetCategories)
  console.log('target recipe: ', targetRecipe)
  return [targetRecipe, targetCategories, targetIngedients]
}

module.exports = parseRecipe
