
//const schedule = require('node-schedule')
//var CronJob = require('cron').CronJob;
var cron = require('cron-scheduler')
//define functions and then schedule in same file
process.env.accountSid = 'AC73c8fa517d3e83ccc4c9c6897586ce8e';
process.env.authToken = '9622761b850dfc615521b37b1266db99';
const accountSid = process.env.accountSid
const authToken = process.env.authToken
const client = require('twilio')(accountSid, authToken);

function morningText() {

  client.messages
    .create({
       body: 'What do you want to cook today?',
       from: '+18064244869',
       to: '+13364136015'
     })
    .then(message => console.log(message.sid))
    .done();


}

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

function afterText() {
  client.messages
    .create({
      body: 'How was your meal? Enter a rating 1-5',
      from: '+18064244869',
      to: '+13364136015'
    })
    .then(message => console.log(message.sid))
    .done();
}


  const cronJob = cron({on: '30 8 * * *'}, function() {
    morningText()
    console.log('inside cron job 2')
  })

  console.log('job started')


    const cronJob2 = cron({on:'00 17 * * *'}, function () {
      eveningText()
      console.log('inside cron job 3')
    })



      const cronJob3 = cron({on: '00 19 * * *'}, function() {
        afterText()
        console.log('inside cron job')
      })


