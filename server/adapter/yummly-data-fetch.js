const axios = require('axios')
const fs = require('fs')
if (process.env.NODE_ENV !== 'production') require('../../secrets')

const testTerms = ['burrito', 'pizza']
const terms = [
  'christmas',
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
  'parmesan',
  'peas',
  'beef',
  'tacos',
  'indian',
  'fish',
  'meatball',
  'Nuts',
  'Pescetarian',
  'Paleo',
  'Vegetarian'
]

//
// ingredientLines
// images.hostedLargeUrl

const getRecipe = async recipeId => {
  try {
    const uri = `http://api.yummly.com/v1/api/recipe/${recipeId}`
    const params = {
      _app_id: process.env.YUMMLY_ID,
      _app_key: process.env.YUMMLY_KEY
    }
    const {data} = await axios.get(uri, {params})
    // console.log(data)
    return data
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
  console.log('process.env.YUMMLY_ID:', process.env)
  console.log('process.env.YUMMLY_KEY:', process.env.YUMMLY_KEY)
  try {
    const uri = `http://api.yummly.com/v1/api/recipes`
    const params = {
      _app_id: process.env.YUMMLY_ID,
      _app_key: process.env.YUMMLY_KEY,
      q: searchTerm,
      requirePictures: true,
      maxResult: 1
    }
    const {data} = await axios.get(uri, {params})
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
      yummlyData.push({
        sourceId: recipeData.id,
        source: 'YUMMLY',
        prepTimeSeconds: recipeData.totalTimeInSeconds,
        prepTime: singleRecipeData.prepTime,
        numberOfServings: singleRecipeData.numberOfServings,
        sourceRecipeUrl: singleRecipeData.source.sourceRecipeUrl,
        ingredientList: singleRecipeData.ingredientLines,
        ingredients: recipeData.ingredients,
        imageUrl: singleRecipeData.images[0].hostedLargeUrl,
        title: recipeData.recipeName,
        cuisine: recipeData.attributes.cuisine,
        course: recipeData.attributes.course,
        holiday: recipeData.attributes.holiday
      })
    }
  }
  fs.writeFileSync(__dirname + '/yummly-data.json', JSON.stringify(yummlyData))
}

fetchData()
