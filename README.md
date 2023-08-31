# feathers-stripe

[![CI](https://github.com/feathersjs-ecosystem/feathers-stripe/workflows/CI/badge.svg)](https://github.com/feathersjs-ecosystem/feathers-stripe/actions?query=workflow%3ACI)
[![Dependency Status](https://img.shields.io/librariesio/release/npm/feathers-stripe)](https://libraries.io/npm/feathers-stripe)
[![Download Status](https://img.shields.io/npm/dm/feathers-stripe.svg?style=flat-square)](https://www.npmjs.com/package/feathers-stripe)
[![Discord](https://badgen.net/badge/icon/discord?icon=discord&label)](https://discord.gg/qa8kez8QBx)

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
- Feathers `update` -> Stripe `update`
- Feathers `patch` -> Stripe `update` (in most cases). Some special cases include paying an invoice or an order when you pass `{pay: true}` as part of `context.data`. See each service's code for more info.
- Feathers `remove` -> Stripe `del` (in most cases). Some special cases include transfers and charges create a reversal/refund. See each service's code for more info.

If a method is not supported by Stripe for a given resource it is not supported here as well.

Use `params.stripe` to pass additional parameters like `expand`, `idempotencyKey`, `apiVersion`, etc to the underlying Stripe methods.

Many methods support/require passing special properties to `context.data` and `context.query` to better inform the underlying stripe methods. You are encouraged to read the source code for each service to better understand their usage. For example, the `Card` service requires a `customer` to be provided.

```ts
const card = await app.service("stripe/cards").create({
  customer: "cust_123",
  source: { token: "tok_123" }
});
// stripe.customers.createSource(customer, { source: { ... } });

const card = await app.service("stripe/cards").get("card_123", {
  query: { customer: "cust_123" }
});
// stripe.customers.retrieveSource(query.customer, id);
```

### Available Services

The following services are supported and map to the appropriate Stripe resource:

- `AccountLinks`
- `Account`
- `ApplicationFeeRefund`
- `Balance`
- `BankAccount`
- `Card`
- `Charge`
- `Coupon`
- `Customer`
- `Dispute`
- `Event`
- `ExternalAccount`
- `InvoiceItem`
- `Invoice`
- `PaymentIntent`
- `PaymentMethod`
- `Payout`
- `Plan`
- `Price`
- `Product`
- `Recipient`
- `Refund`
- `SetupIntent`
- `Source`
- `SubscriptionItem`
- `Subscription`
- `Token`
- `Transaction`
- `TransferReversal`
- `Transfer`
- `Webhook`

**This is pretty important!** Since this connects to your Stripe account you want to make sure that you don't expose these endpoints via your app unless the user has the appropriate permissions. You can prevent any external access by doing this:

```ts
import { Forbidden } from "@feathersjs/errors";

app.service("stripe/cards").hooks({
  before: {
    all: [
      (context) => {
        if (context.params.provider) {
          throw new Forbidden("You are not allowed to access this");
        }
      }
    ]
  }
});
```

**This is pretty important!** You are also encouraged to use some kind of rate limiter. Checkout the [Stripe Rate Limit Docs](https://stripe.com/docs/rate-limits)

```ts
import Bottleneck from 'bottleneck';

// Configure 100 reqs/second for production, 25 for test mode
const readLimiter = new Bottleneck({ minTime: 10 });
const writeLimiter = new Bottleneck({ minTime: 10 });
// const readLimiter = new Bottleneck({ minTime: 40 });
// const writeLimiter = new Bottleneck({ minTime: 40 });

const rateLimitHook = async (context) => {
  const limiter = context.method === 'find' || context.method === 'get'
    ? readLimiter
    : writeLimiter;

  context.result = await limiter.schedule(() => {
    // Use an underscored method to bypass hooks and not end
    // up in an infinite loop hitting this hook again.
    if (context.method === 'find') {
      return context.service._find(context.params);
    }
    if (context.method === 'get') {
      return context.service._get(context.id, context.params);
    }
    if (context.method === 'create') {
      return context.service._create(context.data, context.params);
    }
    if (context.method === 'update') {
      return context.service._update(context.id, context.data, context.params);
    }
    if (context.method === 'patch') {
      return context.service._patch(context.id, context.data, context.params);
    }
    if (context.method === 'remove') {
      return context.service._remove(context.id context.params);
    }
  });

  return context;
}

// The rateLimitHook should be the last before hook for each method.
app.service('stripe/cards').hooks({
  before: {
    find: [ ...hooks, rateLimitHook],
    get: [ ...hooks, rateLimitHook],
    create: [ ...hooks, rateLimitHook],
    update: [ ...hooks, rateLimitHook],
    patch: [ ...hooks, rateLimitHook],
    remove: [ ...hooks, rateLimitHook],
  }
});
```

## Complete Example

Here's an example of a Feathers server that uses `feathers-authentication` for local auth. It includes a `users` service that uses `feathers-mongoose`. _Note that it does NOT implement any authorization._

```ts
import { feathers } from "@feathersjs/feathers";
import express from "@feathersjs/express";
import socketio from "@feathersjs/socketio";
import { ChargeService } from "feathers-stripe";

// Initialize the application
const app = feathers()
  .configure(express.rest())
  .configure(socketio())
  // Needed for parsing bodies (login)
  .use(express.json())
  .use(express.urlencoded({ extended: true }))
  // A simple Message service that we can used for testing
  .use(
    "/stripe/charges",
    new ChargeService({ secretKey: "your secret stripe key" })
  )
  .use("/", feathers.static(__dirname + "/public"))
  .use(express.errorHandler({ html: false }));

const validateCharge = () => (hook) => {
  console.log("Validating charge code goes here");
};

const chargeService = app.service("stripe/charges");

chargeService.hooks({
  before: {
    create: [validateCharge()]
  }
});

const charge = {
  amount: 400,
  currency: "cad",
  source: "tok_87rau6axWXeqLq", // obtained with Stripe.js
  description: "Charge for test@example.com"
};

chargeService
  .create(charge)
  .then((result) => {
    console.log("Charge created", result);
  })
  .catch((error) => {
    console.log("Error creating charge", error);
  });

app.listen(3030);

console.log("Feathers authentication app started on 127.0.0.1:3030");
```

## Webhook

You can setup a webhook using the helper function `setupWebhook` in your service

setupWebhook: (app, route, {
endpointSecret: 'webhook-endpoint-secret',
secretKey: 'your-secret-key'
handlers: {}
})

```ts
export default function (app) {
  setupWebhook(app, "/stripe-webhook", {
    endpointSecret: "whsec_ededqwdwqdqwdqwd778qwdwqdq",
    secretKey: "sk_test_OINqdwqdE89EFqdwwdwqdqdWDQ",
    handlers: {
      customer: {
        subscription: {
          async created({ object, event, params, app }) {
            return {};
          }
        }
      }
    }
  });

  // Get our initialized service so that we can register hooks
  const service = app.service("stripe-webhook");

  service.hooks(hooks);
}
```

## License

Licensed under the [MIT license](LICENSE).
