var feathers = require('feathers');
var rest = require('feathers-rest');
var socketio = require('feathers-socketio');
var hooks = require('feathers-hooks');
var bodyParser = require('body-parser');
var errorHandler = require('feathers-errors/handler');
var stripe = require('../lib/index');

// Initialize the application
var app = feathers()
  .configure(rest())
  .configure(socketio())
  .configure(hooks())
  // Needed for parsing bodies (login)
  .use(bodyParser.json())
  .use(bodyParser.urlencoded({ extended: true }))
  // A simple Message service that we can used for testing
  .use('/stripe/charges', stripe.charge({ secretKey: 'your api key' }))
  .use('/', feathers.static(__dirname + '/public'))
  .use(errorHandler({ html: false }));


function validateCharge() {
  return function(hook) {
    console.log('Validating charge code goes here');
  };
}


var cardService = app.service('stripe/charges');

cardService.before({
  create: [validateCharge()]
});

var Charge = {
  amount: 400,
  currency: "cad",
  source: "tok_87rau6axWXeqLq", // obtained with Stripe.js
  description: "Charge for test@example.com"
};

cardService.create(Charge).then(result => {
  console.log('Charge created', result);
}).catch(error => {
  console.log('Error creating charge', error);
});

app.listen(3030);

console.log('Feathers authentication app started on 127.0.0.1:3030');
