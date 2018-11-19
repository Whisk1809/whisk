const accountSid = 'AC73c8fa517d3e83ccc4c9c6897586ce8e';
const authToken = '9622761b850dfc615521b37b1266db99';
const client = require('twilio')(accountSid, authToken);
//const schedule = require('node-schedule')
var CronJob = require('cron').CronJob;
//define functions and then schedule in same file


function morningText() {

  client.messages
    .create({
       body: 'This is the ship that made the Kessel Run in fourteen parsecs?',
       from: '+18064244869',
       to: '+13364136015'
     })
    .then(message => console.log(message.sid))
    .done();


}

console.log('before job')
const job = new CronJob('* * * * * *', function() {
  console.log('You will see this message ');
});
console.log('after job instantiation')
job.start()

console.log('job started')
