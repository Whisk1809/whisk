const _app_id = '17a7b50a'
const _app_key = '24c0fdf7b4d6c17c0032b72e425362fe'
const axios = require('axios')

const getRecipe = async recipeId => {
  const uri = `http://api.yummly.com/v1/api/recipe/${recipeId}`
  const params = {_app_id, _app_key}
  const {data} = await axios.get(uri, params)
}

const searchRecipes = async searchTerm => {
  const uri = `http://api.yummly.com/v1/api/recipes`
  const params = {
    _app_id,
    _app_key,
    q: searchTerm,
    requirePictures: true,
    maxResult: 10
  }
  const {data} = await axios.get(uri, params)
}
