const {accountSid, authToken} = require('./secrets')
const client = require('twilio')(accountSid, authToken);
//const schedule = require('node-schedule')
var CronJob = require('cron').CronJob;
//define functions and then schedule in same file


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

//modify the function below so that instead of console logging, it runs morningText function at a specific time in the morning
console.log('before job')
const job = new CronJob('30 8 * * *', function() {
  console.log('You will see this message ');
  morningText()
});
console.log('after job instantiation')
job.start()

console.log('job started')

const job2 = new CronJob('30 17 * * *', function() {
  console.log('See job2')
  eveningText()
});
job2.start()
console.log('job2 started')
