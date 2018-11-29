//const schedule = require('node-schedule')
//var CronJob = require('cron').CronJob;
var cron = require('cron-scheduler')

require('./secrets')

const accountSid = process.env.accountSid
const authToken = process.env.authToken
const client = require('twilio')(accountSid, authToken)

console.log('job started')

function morningText() {
  client.messages
    .create({
      body:
        "What do you want to cook today? Text 'Show me' to see today's recommendation!",
      from: '+18064244869',
      to: '+17704906689'
    })
    .then(message => console.log(message.sid))
    .done()
}

function eveningText() {
  client.messages
    .create({
      body: 'Time to start cooking!',
      from: '+18064244869',
      to: '+17704906689'
    })
    .then(message => console.log(message.sid))
    .done()
}

function afterText() {
  client.messages
    .create({
      body: 'How was your meal? Type like or dislike',
      from: '+18064244869',
      to: '+17704906689'
    })
    .then(message => console.log(message.sid))
    .done()
}

function testText() {
  client.messages
    .create({
      body: 'test',
      from: '+18064244869',
      to: '+17704906689'
    })
    .then(message => console.log(message.sid))
    .done()
}
//modify the function below so that instead of console logging, it runs morningText function at a specific time in the morning

const cronJob = cron({on: '45 16 * * *'}, function() {
  morningText()
  console.log('inside morning text')
})

const cronJob2 = cron({on: '06 17 * * *'}, function() {
  eveningText()
  console.log('inside evening text')
})

const cronJob3 = cron({on: '45 21 * * *'}, function() {
  afterText()
  console.log('inside after text')
})

const cronJob4 = cron({on: '49 10 * * *'}, function() {
  testText()
  console.log('still testing')
})
