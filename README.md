# feathers-stripe

[![Greenkeeper badge](https://badges.greenkeeper.io/feathersjs/feathers-stripe.svg)](https://greenkeeper.io/)

[![Build Status](https://travis-ci.org/feathersjs/feathers-stripe.png?branch=master)](https://travis-ci.org/feathersjs/feathers-stripe)
[![Code Climate](https://codeclimate.com/github/feathersjs/feathers-stripe.png)](https://codeclimate.com/github/feathersjs/feathers-stripe)
[![Test Coverage](https://codeclimate.com/github/feathersjs/feathers-stripe/badges/coverage.svg)](https://codeclimate.com/github/feathersjs/feathers-stripe/coverage)
[![Dependency Status](https://img.shields.io/david/feathersjs/feathers-stripe.svg?style=flat-square)](https://david-dm.org/feathersjs/feathers-stripe)
[![Download Status](https://img.shields.io/npm/dm/feathers-stripe.svg?style=flat-square)](https://www.npmjs.com/package/feathers-stripe)
[![Slack Status](http://slack.feathersjs.com/badge.svg)](http://slack.feathersjs.com)

> A Feathers service for Stripe

**This is still a work in progress and is not ready for production.** Pull requests welcome! :smile:

## Installation

```
npm install feathers-stripe --save
```

## Documentation

Please refer to the [Stripe API Docs](https://stripe.com/docs/api/node) and the [stripe-node docs](https://github.com/stripe/stripe-node) for options that can be passed. Feathers service methods map to the following Stripe methods:

- Feathers `find` -> Stripe `list`
- Feathers `get` -> Stripe `retrieve`
- Feathers `create` -> Stripe `create`
- Feathers `patch` -> Stripe `update` (in most cases). Some special cases in include paying an invoice or an order when you pass `{pay: true}` as part of `hook.data`.
- Feathers `update` -> Stripe `update`
- Feathers `remove` -> Stripe `del` (except in the case of transfers where we create a reversal)

If a method is not supported by Stripe for a given resource it is not support here as well.

### Available Services

The following services are supported and map to the appropriate Stripe resource:

- `account`
- `bankAccount`
- `balance`
- `card`
- `charge`
- `coupon`
- `customer`
- `customerSubscription`
- `dispute`
- `event`
- `invoiceItem`
- `invoice`
- `order`
- `payout`
- `plan`
- `product`
- `recipient`
- `refund`
- `sku`
- `subscription`
- `token`
- `transaction`
- `transfer`
- `transferReversal`

They are all referenced by `stripe.<resource>` and can be used like so:

```js
var stripe = require('feathers-stripe');
app.use('/stripe/charges', stripe.charge({ secretKey: 'your secret stripe key' }));
```

#### Webhooks

Coming Soon!

#### Connect

Coming soon!

### Currently Unsupported Resources

The following are not fully supported. If you wish to add support pull requests are very welcome.

- `applePayDomains`
- charge meta data
- customer metadata
- recipient metadata
- transfer metadata
- bank account verification
- `threeDSecure`
- `bitcoinReceivers`

Pagination is also not currently supported. You can `limit` results for finds but you need to handle pagination yourself.

### Security

**This is pretty important!** Since this connects to your Stripe account you want to make sure that you don't expose these endpoints via your app unless the user has the appropriate permissions. You can prevent any external access by doing this:

```js
var hooks = require('feathers-hooks');

app.service('/stripe/charges').before({
  all: [hooks.disable('external')]
});
```

To learn what that actually did you can read [about some of the built-in Feathers hooks](https://docs.feathersjs.com/hooks/bundled.html#disable) and [about securing your Feathers app](https://docs.feathersjs.com/SECURITY.html).

## Complete Example

Here's an example of a Feathers server that uses `feathers-authentication` for local auth.  It includes a `users` service that uses `feathers-mongoose`.  *Note that it does NOT implement any authorization.*

```js
var feathers = require('feathers');
var rest = require('feathers-rest');
var socketio = require('feathers-socketio');
var hooks = require('feathers-hooks');
var bodyParser = require('body-parser');
var errorHandler = require('feathers-errors/handler');
var stripe = require('feather-stripe');

// Initialize the application
var app = feathers()
  .configure(rest())
  .configure(socketio())
  .configure(hooks())
  // Needed for parsing bodies (login)
  .use(bodyParser.json())
  .use(bodyParser.urlencoded({ extended: true }))
  // A simple Message service that we can used for testing
  .use('/stripe/charges', stripe.charge({ secretKey: 'your secret stripe key' }))
  .use('/', feathers.static(__dirname + '/public'))
  .use(errorHandler({ html: false }));


function validateCharge() {
  return function(hook) {
    console.log('Validating charge code goes here');
  };
}


var chargeService = app.service('stripe/charges');

chargeService.before({
  create: [validateCharge()]
});

var Charge = {
  amount: 400,
  currency: "cad",
  source: "tok_87rau6axWXeqLq", // obtained with Stripe.js
  description: "Charge for test@example.com"
};

chargeService.create(Charge).then(result => {
  console.log('Charge created', result);
}).catch(error => {
  console.log('Error creating charge', error);
});

app.listen(3030);

console.log('Feathers authentication app started on 127.0.0.1:3030');
```


## Changelog

__0.3.0__

- Updating cards service to use the appropriate methods
- Updating stripe-node dependency
- Adding the majority of the services
- Adding support for `$limit` for find queries
- Updating documentation and adding some more tests

__0.2.0__

- Adding some more resources

__0.1.0__

- Initial release

## License

Copyright (c) 2015

Licensed under the [MIT license](LICENSE).
