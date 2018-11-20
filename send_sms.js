
//const schedule = require('node-schedule')
//var CronJob = require('cron').CronJob;
var cron = require('cron-scheduler')
//define functions and then schedule in same file

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

//modify the function below so that instead of console logging, it runs morningText function at a specific time in the morning


//cronJob.run()


// console.log('before job')
// const job = new CronJob('30 8 * * *', function() {
  //   console.log('You will see this message ');
  //   morningText()
  // });
  // console.log('after job instantiation')
  // job.start()

  //refactor as cronJob

  const cronJob = cron({on: '30 8 * * *'}, function() {
    morningText()
    console.log('inside cron job 2')
  })

  //console.log('job started')

  // const job2 = new CronJob('00 42 15 * * *', function() {
    //   console.log('See job2')
    //   eveningText()
    // });
    // job2.start()
    //console.log('job2 started')

    const cronJob2 = cron({on:'00 17 * * *'}, function () {
      eveningText()
      console.log('inside cron job 3')
    })

    // const job3 = new CronJob('*/15 32 15 * * 1-5', function() {
      //   console.log('See job3')
      //   afterText()
      // });
      // job2.start()
      // console.log('job2 started')
      // job3.start()

      const cronJob3 = cron({on: '45 15 * * *'}, function() {
        afterText()
        console.log('inside cron job')
      })


