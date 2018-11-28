var cron = require('cron-scheduler')

require('./secrets')

const accountSid = process.env.accountSid
const authToken = process.env.authToken
const client = require('twilio')(accountSid, authToken);


console.log('job started')

function morningText() {

  client.messages
    .create({
       body: 'What do you want to cook today? Text \'Show me\' to see today\'s recommendation!',
       from: '+18064244869',
       to: '+13364136015'
     })
    .then(message => console.log(message.sid))
    .done();


}
// const cronJob = cron({on: '30 09 * * *'}, function() {
//   morningText()
//   console.log('inside morning text')
// })
