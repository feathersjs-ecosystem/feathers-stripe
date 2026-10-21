# feathers-stripe

[![CI](https://github.com/feathersjs-ecosystem/feathers-stripe/actions/workflows/nodejs.yml/badge.svg?branch=master)](https://github.com/feathersjs-ecosystem/feathers-stripe/actions/workflows/nodejs.yml?query=branch%3Amaster)
[![npm](https://img.shields.io/npm/v/feathers-stripe)](https://www.npmjs.com/package/feathers-stripe)
[![Dependency Status](https://img.shields.io/librariesio/release/npm/feathers-stripe)](https://libraries.io/npm/feathers-stripe)
[![Download Status](https://img.shields.io/npm/dm/feathers-stripe.svg?style=flat-square)](https://www.npmjs.com/package/feathers-stripe)
[![Discord](https://badgen.net/badge/icon/discord?icon=discord&label)](https://discord.gg/qa8kez8QBx)

> Feathers services for Stripe

## Installation

```
npm install feathers-stripe stripe
```

`feathers-stripe` is ESM only and requires Node.js 24 or later, `stripe@^23` and `@feathersjs/feathers@^5`.

## Usage

Every service takes a `stripe` instance and is registered like any other Feathers service:

```ts
import { Stripe } from 'stripe'
import { CustomerService } from 'feathers-stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

app.use('stripe/customers', new CustomerService({ stripe }))

const customer = await app
  .service('stripe/customers')
  .create({ email: 'jane@example.com' })
```

**Protect these services!** They act on your Stripe account with your secret key. Unless a user is explicitly allowed to, block all external access (REST, websockets) and only call them from your own code. See [Security](#security).

### Method mapping

| Feathers | Stripe                                                                            |
| -------- | --------------------------------------------------------------------------------- |
| `find`   | `list`                                                                            |
| `get`    | `retrieve`                                                                        |
| `create` | `create`                                                                          |
| `update` | `update`                                                                          |
| `patch`  | `update`, with some special cases (see [Available services](#available-services)) |
| `remove` | `del`, or the closest equivalent like `cancel`, `void` or `expire`                |
| `search` | `search` (only `Customer` and `Invoice`)                                          |

Methods that Stripe doesn't support for a resource reject with a `NotImplemented` error.

### Request options

Use `params.stripe` to pass [request options](https://github.com/stripe/stripe-node#per-request-configuration) like `stripeAccount`, `idempotencyKey` or `apiVersion`:

```ts
await app
  .service('stripe/customers')
  .create(
    { email: 'jane@example.com' },
    { stripe: { stripeAccount: 'acct_123', idempotencyKey: 'signup-42' } },
  )
```

### Querying

`params.query` is passed to Stripe's `list` method. Feathers style `$` prefixes are removed, so `$limit` becomes `limit` and `{ created: { $gt: 1700000000 } }` becomes `{ created: { gt: 1700000000 } }`.

```ts
const invoices = await app.service('stripe/invoices').find({
  query: { customer: 'cus_123', status: 'open', $limit: 50 },
})
```

### Pagination

`find` returns Stripe's list object, **not** the Feathers pagination format:

```ts
{ object: 'list', data: [/* ... */], has_more: true, url: '/v1/invoices' }
```

To get the next page, pass the id of the last item as `starting_after`. `$limit` is capped at 100, which is Stripe's maximum. To change that, pass your own `paginate` option to the service.

With `paginate: false`, `find` fetches all pages and returns a plain array:

```ts
const allInvoices = await app.service('stripe/invoices').find({
  query: { customer: 'cus_123' },
  paginate: false,
})
```

### Expanding responses

Use `params.query.expand` to [expand](https://docs.stripe.com/expand) related objects. For `get` only `expand` is passed on. For `find` the whole query is passed on, so the paths need the `data.` prefix:

```ts
await app.service('stripe/customers').get('cus_123', {
  query: { expand: ['default_source'] },
})

await app.service('stripe/invoices').find({
  query: { expand: ['data.subscription'] },
})
```

### Search

`CustomerService` and `InvoiceService` have a `search` method for Stripe's [search query language](https://docs.stripe.com/search):

```ts
const result = await app.service('stripe/customers').search({
  query: { query: "email:'jane@example.com'" },
})
```

`search` is a custom method. To call it from a client, add it to the service's `methods` when registering it.

### Errors

Stripe errors are converted to Feathers errors. The original Stripe error is available as `error.data`.

| Stripe                      | Feathers           |
| --------------------------- | ------------------ |
| `StripeCardError`           | `PaymentError`     |
| `StripeInvalidRequestError` | `BadRequest`       |
| `StripeAPIError`            | `Unavailable`      |
| `StripeConnectionError`     | `Unavailable`      |
| `StripeAuthenticationError` | `NotAuthenticated` |
| `StripePermissionError`     | `Forbidden`        |
| `StripeRateLimitError`      | `TooManyRequests`  |
| anything else               | `GeneralError`     |

If a required parent id like `customer` is missing, the service rejects with a `BadRequest` before calling Stripe.

## Available services

Services for nested Stripe resources need the id of their parent object. It is passed in `params.query` or `data` as noted below.

| Service                              | Stripe resource                | Notes                                                                                                                                        |
| ------------------------------------ | ------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------- |
| `AccountService`                     | `accounts`                     |                                                                                                                                              |
| `AccountLinkService`                 | `accountLinks`                 | `create` only                                                                                                                                |
| `ApplicationFeeRefundService`        | `applicationFees.*Refund*`     | Requires `query.fee`                                                                                                                         |
| `BalanceService`                     | `balance`                      | `get` only. The id is used as `stripeAccount` for connected accounts                                                                         |
| `BalanceTransactionService`          | `balanceTransactions`          | `find` and `get` only                                                                                                                        |
| `BankAccountService`                 | `customers.*Source*`           | **Deprecated**, use `PaymentMethodService`. Requires `query.customer`                                                                        |
| `BillingMeterService`                | `billing.meters`               | `remove` deactivates the meter                                                                                                               |
| `BillingMeterEventService`           | `billing.meterEvents`          | `create` only                                                                                                                                |
| `ChargeService`                      | `charges`                      | `patch` with `{ capture: true }` captures. `remove` refunds the charge                                                                       |
| `CheckoutSessionService`             | `checkout.sessions`            | `remove` expires the session                                                                                                                 |
| `CouponService`                      | `coupons`                      |                                                                                                                                              |
| `CreditNoteService`                  | `creditNotes`                  | `remove` voids the credit note                                                                                                               |
| `CustomerService`                    | `customers`                    | Supports `search`                                                                                                                            |
| `CustomerPortalConfigurationService` | `billingPortal.configurations` |                                                                                                                                              |
| `CustomerPortalSessionService`       | `billingPortal.sessions`       | `create` only                                                                                                                                |
| `CustomerSessionService`             | `customerSessions`             | `create` only                                                                                                                                |
| `DisputeService`                     | `disputes`                     |                                                                                                                                              |
| `EventService`                       | `events`                       | `find` and `get` only                                                                                                                        |
| `ExternalAccountService`             | `accounts.*ExternalAccount*`   | Requires `query.account`, for `create` `data.account`                                                                                        |
| `InvoiceService`                     | `invoices`                     | `patch` with `{ pay: true }` pays the invoice. Supports `search`                                                                             |
| `InvoiceItemService`                 | `invoiceItems`                 |                                                                                                                                              |
| `PaymentIntentService`               | `paymentIntents`               | `patch` with `{ capture: true }`, `{ confirm: true }` or `{ cancel: true }` captures, confirms or cancels. Other fields are passed to Stripe |
| `PaymentLinkService`                 | `paymentLinks`                 |                                                                                                                                              |
| `PaymentMethodService`               | `paymentMethods`               | `patch` with `{ attach: true, customer }` attaches. `remove` detaches                                                                        |
| `PayoutService`                      | `payouts`                      | `remove` cancels the payout                                                                                                                  |
| `PlanService`                        | `plans`                        | **Deprecated**, use `PriceService`                                                                                                           |
| `PriceService`                       | `prices`                       |                                                                                                                                              |
| `ProductService`                     | `products`                     |                                                                                                                                              |
| `PromotionCodeService`               | `promotionCodes`               |                                                                                                                                              |
| `RefundService`                      | `refunds`                      |                                                                                                                                              |
| `SetupIntentService`                 | `setupIntents`                 |                                                                                                                                              |
| `SourceService`                      | `sources`                      | **Deprecated**, use `PaymentMethodService`. `create` with `data.customer` attaches to a customer                                             |
| `SubscriptionService`                | `subscriptions`                | `remove` cancels the subscription                                                                                                            |
| `SubscriptionItemService`            | `subscriptionItems`            |                                                                                                                                              |
| `SubscriptionScheduleService`        | `subscriptionSchedules`        | `remove` cancels the schedule                                                                                                                |
| `TaxRateService`                     | `taxRates`                     |                                                                                                                                              |
| `TokenService`                       | `tokens`                       | `get` and `create` only                                                                                                                      |
| `TransferService`                    | `transfers`                    | `remove` reverses the transfer                                                                                                               |
| `TransferReversalService`            | `transfers.*Reversal*`         | Requires `query.transfer`, for `create` `data.transfer`                                                                                      |
| `WebhookService`                     | -                              | See [Webhooks](#webhooks)                                                                                                                    |

Example for a nested resource:

```ts
app.use('stripe/external-accounts', new ExternalAccountService({ stripe }))

const bankAccount = await app
  .service('stripe/external-accounts')
  .create({ account: 'acct_123', external_account: 'btok_123' })
// stripe.accounts.createExternalAccount('acct_123', { external_account: 'btok_123' })

await app.service('stripe/external-accounts').get('ba_123', {
  query: { account: 'acct_123' },
})
// stripe.accounts.retrieveExternalAccount('acct_123', 'ba_123')
```

## Webhooks

`setupWebhook` registers a webhook service at the given route. It only allows `create` and verifies the `stripe-signature` header of every request against the raw request body before any handler runs. The verified event is passed to the service as `params.stripeEvent`. External calls without a verified event (e.g. via websockets) are rejected with `NotAuthenticated`.

Stripe signs the raw request body, so keep it around when parsing JSON:

```ts
import { json } from '@feathersjs/express'

app.use(
  json({
    verify: (req, res, buf) => {
      req.rawBody = buf
    },
  }),
)
```

Then register the webhook with handlers for the [event types](https://docs.stripe.com/api/events/types) you need. A handler for `customer.subscription.created` is looked up at `handlers.customer.subscription.created`. The return value of the handler is sent back to Stripe. Events without a handler resolve with `{}`.

```ts
import { Stripe } from 'stripe'
import { setupWebhook } from 'feathers-stripe'

const service = setupWebhook(app, 'stripe/webhook', {
  endpointSecret: process.env.STRIPE_WEBHOOK_SECRET,
  stripe: new Stripe(process.env.STRIPE_SECRET_KEY),
  handlers: {
    customer: {
      subscription: {
        async created({ object, event, params, app }) {
          // object is the subscription
          return {}
        },
      },
    },
  },
})

// `service` is the registered service, so hooks can be added
service.hooks({ before: { create: [logEvent] } })
```

The webhook service must stay reachable from outside. Don't add the internal-only hook from [Security](#security) to it.

## Security

Block external access to all Stripe services that users shouldn't call directly:

```ts
import { Forbidden } from '@feathersjs/errors'

const internalOnly = async (context) => {
  if (context.params.provider) {
    throw new Forbidden('You are not allowed to access this')
  }
}

app.service('stripe/customers').hooks({
  before: { all: [internalOnly] },
})
```

### Rate limiting

Stripe [limits the number of requests](https://docs.stripe.com/rate-limits) per second. An `around` hook with a rate limiter like [Bottleneck](https://github.com/SGrondin/bottleneck) keeps you below that:

```ts
import Bottleneck from 'bottleneck'

// about 100 requests per second in live mode. Use { minTime: 40 } for test mode
const readLimiter = new Bottleneck({ minTime: 10 })
const writeLimiter = new Bottleneck({ minTime: 10 })

const rateLimit = async (context, next) => {
  const limiter =
    context.method === 'find' || context.method === 'get'
      ? readLimiter
      : writeLimiter

  await limiter.schedule(() => next())
}

app.service('stripe/customers').hooks({
  around: { all: [rateLimit] },
})
```

## Complete example

A Feathers app that creates payment intents from its own `orders` service and handles the result in a webhook. The Stripe services themselves are not reachable from outside.

```ts
import { feathers } from '@feathersjs/feathers'
import express, {
  errorHandler,
  json,
  notFound,
  rest,
  urlencoded,
} from '@feathersjs/express'
import { Forbidden } from '@feathersjs/errors'
import { Stripe } from 'stripe'
import { PaymentIntentService, setupWebhook } from 'feathers-stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

const app = express(feathers())

app.use(
  json({
    verify: (req, res, buf) => {
      req.rawBody = buf
    },
  }),
)
app.use(urlencoded({ extended: true }))
app.configure(rest())

app.use('stripe/payment-intents', new PaymentIntentService({ stripe }))

app.service('stripe/payment-intents').hooks({
  before: {
    all: [
      async (context) => {
        if (context.params.provider) {
          throw new Forbidden('You are not allowed to access this')
        }
      },
    ],
  },
})

// Your own service decides what a user may pay for
app.use('orders', {
  async create(data) {
    const paymentIntent = await app.service('stripe/payment-intents').create({
      amount: 2000,
      currency: 'eur',
      automatic_payment_methods: { enabled: true },
      metadata: { product: data.product },
    })

    // The client confirms the payment with Stripe.js
    return { clientSecret: paymentIntent.client_secret }
  },
})

setupWebhook(app, 'stripe/webhook', {
  endpointSecret: process.env.STRIPE_WEBHOOK_SECRET,
  stripe,
  handlers: {
    payment_intent: {
      async succeeded({ object }) {
        console.log('Payment succeeded', object.id)
        return {}
      },
    },
  },
})

app.use(notFound())
app.use(errorHandler())

await app.listen(3030)
```

## Upgrading from v3

- `feathers-stripe` is ESM only and requires Node.js 24 or later.
- `stripe@^23` is required. Stripe no longer accepts params and request options in the same argument, see the [migration guide](https://github.com/stripe/stripe-node/wiki/Migration-guide-for-v22). `feathers-stripe` passes them correctly now.
- `expand` is no longer a request option. Use `params.query.expand` instead of `params.stripe.expand`. The old way still works but is deprecated.
- `setupWebhook` registers the webhook service itself and needs `req.rawBody`. Remove your own `app.use(route, ...)` for it. The signature is now checked for every external request.
- `CardService` and `TransactionService` are removed. Use `PaymentMethodService` and `BalanceTransactionService`.
- Service methods always return a promise. `NotImplemented` and `BadRequest` reject instead of being thrown synchronously.
- A missing parent id (`customer`, `account`, `transfer`, `fee`) rejects with a `BadRequest` instead of calling Stripe.
- `ApplicationFeeRefundService` expects the fee id in `params.query.fee` for all methods, no longer in `params.stripe.fee`. The `ParamsWithStripeFee` type is removed.
- `StripePermissionError` is converted to `Forbidden` instead of `GeneralError`.

## License

Licensed under the [MIT license](LICENSE).
