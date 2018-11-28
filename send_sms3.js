var cron = require('cron-scheduler')

require('./secrets')

const accountSid = process.env.accountSid
const authToken = process.env.authToken
const client = require('twilio')(accountSid, authToken);



function afterText() {
  client.messages
    .create({
      body: 'How was your meal? Type like or dislike',
      from: '+18064244869',
      to: '+13364136015'
    })
    .then(message => console.log(message.sid))
    .done();
}


// const cronJob3 = cron({on: '45 21 * * *'}, function() {
//   afterText()
//   console.log('inside after text')
// })
