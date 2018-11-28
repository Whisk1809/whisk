var cron = require('cron-scheduler')

require('./secrets')

const accountSid = process.env.accountSid
const authToken = process.env.authToken
const client = require('twilio')(accountSid, authToken);


function eveningText() {

  client.messages
    .create({
      body: 'Time to start cooking!',
      from: '+18064244869',
      to: '+13364136015'
    })
    .then(message => console.log(message.sid))
    .done();
}

// const cronJob2 = cron({on:'06 17 * * *'}, function () {
//   eveningText()
//   console.log('inside evening text')
// })
