
const Yummly = require('ws-yummly')

Yummly.config({
  app_id: '17a7b50a',
  app_key: '24c0fdf7b4d6c17c0032b72e425362fe',
});


const giveRecipes = async () => {
  const arr = ['soup','chicken','lentils']
  const recipes = [];
  for (let i=0; i < arr.length; i++) {
      let resp = await Yummly.query(arr[i]).maxResults(1).get();

      recipes.push(resp);
      }
    return recipes;
}

const logIt = async () => {
  const result = await giveRecipes()
  console.log(result)
}

logIt()
