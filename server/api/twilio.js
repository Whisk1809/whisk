const router = require('express').Router()
const session = require('express-session')
const MessagingResponse = require('twilio').twiml.MessagingResponse;
const twilio = require('twilio')
const {Recipe, User, Preference} = require('../db/models')
const Sequelize = require('sequelize')
const {recommend} = require('../db/graphDb')
const bodyParser = require('body-parser');
//const {updatePreferences} = require('../../client/store');
require('../../secrets')
//const accountSid = 'AC73c8fa517d3e83ccc4c9c6897586ce8e';
//const authToken = '9622761b850dfc615521b37b1266db99';
const accountSid = process.env.accountSid
const authToken = process.env.authToken
const client = require('twilio')(accountSid, authToken);

router.use(bodyParser.urlencoded({ extended: false }));


router.post('/sms', twilio.webhook({validate: false}), async (req, res) => {
  const twiml = new MessagingResponse();
  const recommendations =  await recommend(1)
  //console.log(recommendations, 'recommendation twilio')
  const uId = recommendations[0].recipeId
  const first = await Recipe.findById(uId)
  const uId2 = recommendations[1].recipeId
  const next = await Recipe.findById(uId2)
  const nextAnswer = next.sourceRecipeUrl
  const answer = first.sourceRecipeUrl


  if (req.body.Body == 'Show me') {


    twiml.message(`Okay, try this: ${answer}.  If you don't like that idea, text 'Show me something else'`);
  }

  else if (req.body.Body == 'Show me something else') {
    twiml.message(`No problem. Take a look at this one instead: ${nextAnswer}`)
  }

  else if (req.body.Body == 'Dislike') {
    twiml.message('Good to know, let\'s try something else');

  }
    else if (req.body.Body == 'Like') {
      twiml.message('Great! We will send you more recipes like this.')

      let data = {
       userId: '1',
       recipeId: uId,
       prefers: true
      }
      const newPreference = await Preference.create(data)

    }

  res.writeHead(200, { 'Content-Type': 'text/xml' });
  res.end(twiml.toString());
});

module.exports = router
