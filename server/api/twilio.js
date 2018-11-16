const router = require('express').Router()
const session = require('express-session')
const MessagingResponse = require('twilio').twiml.MessagingResponse;

const accountSid = 'AC73c8fa517d3e83ccc4c9c6897586ce8e';
const authToken = '9622761b850dfc615521b37b1266db99';
const client = require('twilio')(accountSid, authToken);

// router.post('/sms', (req, res) => {
//   const twiml = new MessagingResponse();

//   const message = twiml.message()

//   message.body('The Robots are coming! Head for the hills!');
//   message.media('https://farm8.staticflickr.com/7090/6941316406_80b4d6d50e_z_d.jpg');

//   res.writeHead(200, {'Content-Type': 'text/xml'});
//   res.end(twiml.toString());
// });


router.post('/sms', (req, res) => {
  const twiml = new MessagingResponse();
  console.log('test')
  if (req.body.Body == 'Hello') {
    twiml.message('Hi!');
  } else if (req.body.Body == 'bye') {
    twiml.message('Goodbye');
  } else {
    twiml.message(
      'No Body param match, Twilio sends this in the request to your server.'
    );
  }

  res.writeHead(200, { 'Content-Type': 'text/xml' });
  res.end(twiml.toString());
});

module.exports = router
