import axios from 'axios'

const defaultRecipes = {}

//below is just for mock data now
const trialState = {
  recipes: {
    byId: {
      '1' : {
        id: '1',
        title: "Mac and Cheese",
        prepTime: "50 minutes",
        prepTimeSeconds: 3000,
        sourceRecipeUrl: "https://www.allrecipes.com/recipe/259690/instant-pot-mac-and-cheese-with-ham-and-peas/",
        ingredientList: ['2 cups macaroni', '3 lbs ham', '1 pack cream', '1 can of peas', '1 whatever cheese you like'],
        numberOfServings: 3,
        imageUrl: "https://images.media-allrecipes.com/userphotos/720x405/4548620.jpg"
      },
      '2' : {
        id: '2',
        title: "Mulligatawny Soup",
        prepTime: "30 minutes",
        prepTimeSeconds: 1800,
        sourceRecipeUrl: "https://www.allrecipes.com/recipe/13087/mulligatawny-soup-i/",
        ingredientList: ['1/2 cup chopped onion', ' 2 stalks celery, chopped', '1 carrot, diced', '1 can of peas', '1 whatever cheese you like'],
        numberOfServings: 5,
        imageUrl: "https://images.media-allrecipes.com/userphotos/720x405/3573231.jpg"
      },
      '3': {
        id: '3',
        title: "Spaghetti Squash Mediterranean Style",
        prepTime: "40 minutes",
        prepTimeSeconds: 2400,
        sourceRecipeUrl: "https://www.allrecipes.com/recipe/228544/spaghetti-squash-mediterranean-style",
        ingredientList: ['1 spaghetti squash', '2 tablespoons olive oil', '3 sausage links', '2 spring onions', '3 cloves garlic', '1 zucchini'],
        numberOfServings: 5,
        imageUrl: "https://images.media-allrecipes.com/userphotos/720x405/2322620.jpg"
      },
      '4': {
        id: '4',
        title: "Spaghetti Squash Mediterranean Style",
        prepTime: "40 minutes",
        prepTimeSeconds: 2400,
        sourceRecipeUrl: "https://www.allrecipes.com/recipe/228544/spaghetti-squash-mediterranean-style",
        ingredientList: ['1 spaghetti squash', '2 tablespoons olive oil', '3 sausage links', '2 spring onions', '3 cloves garlic', '1 zucchini'],
        numberOfServings: 5,
        imageUrl: "https://images.media-allrecipes.com/userphotos/720x405/2322620.jpg"
      },
    },
    allIds: ['1', '2', '3', '4']
  }
}

const GET_ALL_RECIPES = 'GET_ALL_RECIPES'
const GET_SINGLE_RECIPE = 'GET_SINGLE_RECIPE'


export const setRecipes = allRecipes => {
  return {
    type: GET_ALL_RECIPES,
    allRecipes
  }
}

export const setSingleRecipe = singleRecipe => {
  return {
    type: GET_SINGLE_RECIPE,
    singleRecipe
  }
}

export const getAllRecipes = () => async dispatch => {
  try {
    const {data} = await axios.get('http://localhost:3000/recipes')
    dispatch(setRecipes(data))
  } catch (err) {
    console.error(err)
  }
}

// uncomment this thunk when the Recipes model is ready to go!
/* export const getAllRecipes = () => async dispatch => {
  try {
    const {data} = await axios.get('/api/recipes')
    dispatch(setRecipes(data))
  } catch (err) {
    console.error(err)
  }
} */

export const getSingleRecipe = (recipeId) => async dispatch => {
  try {
    const {data} = await axios.get(`/api/recipes/${recipeId}`)
    dispatch(setSingleRecipe(data))
  } catch (err) {
    console.error(err)
  }
}

export default function(state = trialState, action) {
  switch (action.type) {
    case GET_ALL_RECIPES:
      return {...state, recipes: action.recipes}
    case GET_SINGLE_RECIPE:
      return {...state, singleRecipe: action.setSingleRecipe}
    default:
      return state
  }
}
