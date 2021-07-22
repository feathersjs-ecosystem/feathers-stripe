# feathers-stripe

[![Greenkeeper badge](https://badges.greenkeeper.io/feathersjs-ecosystem/feathers-stripe.svg)](https://greenkeeper.io/)

[![Build Status](https://travis-ci.org/feathersjs-ecosystem/feathers-stripe.png?branch=master)](https://travis-ci.org/feathersjs-ecosystem/feathers-stripe)
[![Dependency Status](https://img.shields.io/david/feathersjs-ecosystem/feathers-stripe.svg?style=flat-square)](https://david-dm.org/feathersjs-ecosystem/feathers-stripe)
[![Download Status](https://img.shields.io/npm/dm/feathers-stripe.svg?style=flat-square)](https://www.npmjs.com/package/feathers-stripe)
[![Slack Status](http://slack.feathersjs.com/badge.svg)](http://slack.feathersjs.com)

> A Feathers service for Stripe

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
- Feathers `remove` -> Stripe `del` (except in the case of transfers and charges where we create a reversal/refund. Note this creates a full refund/reversal. For more granular control, use the `TransferReversal` and `Refund` services)

If a method is not supported by Stripe for a given resource it is not support here as well.

### Available Services

The following services are supported and map to the appropriate Stripe resource:

- `Account`
- `AccountLinks`
- `ApplicationFeeRefund`
- `BankAccount`
- `Balance`
- `Card`
- `Charge`
- `Coupon`
- `Customer`
- `CustomerSubscription`
- `Dispute`
- `Event`
- `ExternalAccount`
- `InvoiceItem`
- `Invoice`
- `Order`
- `Payout`
- `PaymentIntent`
- `PaymentMethod`
- `Plan`
- `Product`
- `Recipient`
- `Refund`
- `SetupIntent`
- `Sku`
- `Source`
- `Subscription`
- `SubscriptionItem`
- `Token`
- `Transaction`
- `Transfer`
- `TransferReversal`


**This is pretty important!** Since this connects to your Stripe account you want to make sure that you don't expose these endpoints via your app unless the user has the appropriate permissions. You can prevent any external access by doing this:

```js
const { Forbidden } = require('@feathersjs/errors');

app.service('/stripe/charges').hooks({
  before: {
    all: [
      context => {
        if(context.params.provider) {
          throw new Forbidden('You are not allowed to access this');
        }
      }
    ]
  }
});
```

## Complete Example

Here's an example of a Feathers server that uses `feathers-authentication` for local auth.  It includes a `users` service that uses `feathers-mongoose`.  *Note that it does NOT implement any authorization.*

```js
const feathers = require('@feathersjs/feathers');
const express = require('@feathersjs/express');
const socketio = require('@feathersjs/socketio');
var { Charge } = require('feather-stripe');

// Initialize the application
var app = feathers()
  .configure(express.rest())
  .configure(socketio())
  // Needed for parsing bodies (login)
  .use(express.json())
  .use(express.urlencoded({ extended: true }))
  // A simple Message service that we can used for testing
  .use('/stripe/charges', new Charge({ secretKey: 'your secret stripe key' }))
  .use('/', feathers.static(__dirname + '/public'))
  .use(express.errorHandler({ html: false }));


function validateCharge() {
  return function(hook) {
    console.log('Validating charge code goes here');
  };
}


const chargeService = app.service('stripe/charges');

chargeService.before({
  create: [validateCharge()]
});

const charge = {
  amount: 400,
  currency: "cad",
  source: "tok_87rau6axWXeqLq", // obtained with Stripe.js
  description: "Charge for test@example.com"
};

chargeService.create(charge).then(result => {
  console.log('Charge created', result);
}).catch(error => {
  console.log('Error creating charge', error);
});

app.listen(3030);

console.log('Feathers authentication app started on 127.0.0.1:3030');
```

## License

Copyright (c) 2019

Licensed under the [MIT license](LICENSE).
