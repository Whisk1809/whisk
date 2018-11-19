const _app_id = '17a7b50a'
const _app_key = '24c0fdf7b4d6c17c0032b72e425362fe'
const axios = require('axios')

const testTerms = ['burrito', 'pizza']
const terms = [
  'burrito',
  'pizza',
  'sandwich',
  'turkey',
  'thanksgiving',
  'chicken',
  'broccoli',
  'cauliflower',
  'soup',
  'lentils',
  'salad',
  'spaghetti',
  'pasta',
  'lasagna',
  'steak',
  'potato',
  'garlic',
  'kale',
  'parmesan'
]

//
// ingredientLines
// images.hostedLargeUrl

const getRecipe = async recipeId => {
  try {
    const uri = `http://api.yummly.com/v1/api/recipe/${recipeId}`
    const params = {_app_id, _app_key}
    const {data} = await axios.get(uri, {params})
    console.log(data)
  } catch (err) {
    console.error(err)
  }
}

//
// id
// totalTimeInSeconds
// ingredients
// recipeName

const searchRecipes = async searchTerm => {
  try {
    const uri = `http://api.yummly.com/v1/api/recipes`
    const params = {
      _app_id,
      _app_key,
      q: searchTerm,
      requirePictures: true,
      maxResult: 10
    }
    const {data} = await axios.get(uri, {params})
    console.log(data)
    return data
  } catch (err) {
    console.error(err)
  }
}

const fetchRecipeDataFromTerms = async terms => {
  const termRecipeResults = await Promise.all(
    terms.map(term => searchRecipes(term))
  )
  return termRecipeResults.map(recipes => recipes.matches)
}

const yummlyData = []
const fetchData = async () => {
  const recipeTermData = await fetchRecipeDataFromTerms(testTerms) //an array of matches arrays
  for (let i = 0; i < recipeTermData.length; i++) {
    for (let j = 0; j < recipeTermData[i].length; j++) {
      const recipeData = recipeTermData[i][j]
      const singleRecipeData = await getRecipe(recipeTermData[i][j].id)
    }
  }
}

testTerms.map(async term => {
  const {matches} = await searchRecipes(term)
  const recipes = await Promise.all(matches.map(recipe => getRecipe(recipe.id)))
})
