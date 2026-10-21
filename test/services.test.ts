import { expect } from 'vitest'
import { BadRequest, NotImplemented } from '@feathersjs/errors'
import * as services from '../src/index.js'

type ServiceClass = new (options: any) => any
type Method =
  'find' | 'get' | 'create' | 'update' | 'patch' | 'remove' | 'search'

const METHODS: Method[] = [
  'find',
  'get',
  'create',
  'update',
  'patch',
  'remove',
  'search',
]

/**
 * A stripe stub that records every call as `{ path, args }`,
 * e.g. `stripe.checkout.sessions.retrieve('cs_1')` is recorded as
 * `{ path: 'checkout.sessions.retrieve', args: ['cs_1'] }`.
 */
const createStripeMock = () => {
  const calls: { path: string; args: any[] }[] = []
  const make = (path: string[]): any =>
    new Proxy(function () {}, {
      get: (_target, key) =>
        typeof key === 'string' ? make([...path, key]) : undefined,
      apply: (_target, _thisArg, args) => {
        calls.push({ path: path.join('.'), args })
        return Promise.resolve({ id: 'result' })
      },
    })
  return { stripe: make([]), calls }
}

const opts = { stripeAccount: 'acct_connected' }
const params = (query?: Record<string, any>): any => ({
  stripe: opts,
  ...(query && { query }),
})
const data = { metadata: { foo: 'bar' } }

type Case = {
  Service: ServiceClass
  method: Method
  args: any[]
  path: string
  expected: any[]
  name?: string
}

/**
 * The default mapping of a plain stripe resource:
 * find -> list, get -> retrieve, create -> create, update/patch -> update
 */
const resource = (
  Service: ServiceClass,
  path: string,
  id: string,
  methods: ('find' | 'get' | 'create' | 'update' | 'patch')[],
): Case[] => {
  const all: Record<string, Case> = {
    find: {
      Service,
      method: 'find',
      args: [params()],
      path: `${path}.list`,
      expected: [{}, opts],
    },
    get: {
      Service,
      method: 'get',
      args: [id, params()],
      path: `${path}.retrieve`,
      expected: [id, undefined, opts],
    },
    create: {
      Service,
      method: 'create',
      args: [data, params()],
      path: `${path}.create`,
      expected: [data, opts],
    },
    update: {
      Service,
      method: 'update',
      args: [id, data, params()],
      path: `${path}.update`,
      expected: [id, data, opts],
    },
    patch: {
      Service,
      method: 'patch',
      args: [id, data, params()],
      path: `${path}.update`,
      expected: [id, data, opts],
    },
  }
  return methods.map((m) => all[m]!)
}

const call = (
  Service: ServiceClass,
  method: Method,
  args: any[],
  path: string,
  expected: any[],
  name?: string,
): Case => ({ Service, method, args, path, expected, name })

const CRUD = ['find', 'get', 'create', 'update', 'patch'] as const

const cases: Case[] = [
  call(
    services.AccountLinkService,
    'create',
    [data, params()],
    'accountLinks.create',
    [data, opts],
  ),

  ...resource(services.AccountService, 'accounts', 'acct_1', [...CRUD]),

  call(
    services.ApplicationFeeRefundService,
    'find',
    [params({ fee: 'fee_1', limit: 3 })],
    'applicationFees.listRefunds',
    ['fee_1', { limit: 3 }, opts],
  ),
  call(
    services.ApplicationFeeRefundService,
    'get',
    ['fr_1', params({ fee: 'fee_1' })],
    'applicationFees.retrieveRefund',
    ['fee_1', 'fr_1', undefined, opts],
  ),
  call(
    services.ApplicationFeeRefundService,
    'create',
    [data, params({ fee: 'fee_1' })],
    'applicationFees.createRefund',
    ['fee_1', data, opts],
  ),
  call(
    services.ApplicationFeeRefundService,
    'update',
    ['fr_1', data, params({ fee: 'fee_1' })],
    'applicationFees.updateRefund',
    ['fee_1', 'fr_1', data, opts],
  ),
  call(
    services.ApplicationFeeRefundService,
    'patch',
    ['fr_1', data, params({ fee: 'fee_1' })],
    'applicationFees.updateRefund',
    ['fee_1', 'fr_1', data, opts],
  ),

  call(
    services.BalanceService,
    'get',
    ['acct_1', params()],
    'balance.retrieve',
    [undefined, { stripeAccount: 'acct_1' }],
    'uses the id as stripeAccount',
  ),

  ...resource(
    services.BalanceTransactionService,
    'balanceTransactions',
    'txn_1',
    ['find', 'get'],
  ),

  call(
    services.BankAccountService,
    'find',
    [params({ customer: 'cus_1' })],
    'customers.listSources',
    ['cus_1', {}, opts],
  ),
  call(
    services.BankAccountService,
    'get',
    ['ba_1', params({ customer: 'cus_1' })],
    'customers.retrieveSource',
    ['cus_1', 'ba_1', undefined, opts],
  ),
  call(
    services.BankAccountService,
    'create',
    [data, params({ customer: 'cus_1' })],
    'customers.createSource',
    ['cus_1', data, opts],
  ),
  call(
    services.BankAccountService,
    'update',
    ['ba_1', data, params({ customer: 'cus_1' })],
    'customers.updateSource',
    ['cus_1', 'ba_1', data, opts],
  ),
  call(
    services.BankAccountService,
    'patch',
    ['ba_1', data, params({ customer: 'cus_1' })],
    'customers.updateSource',
    ['cus_1', 'ba_1', data, opts],
  ),
  call(
    services.BankAccountService,
    'remove',
    ['ba_1', params({ customer: 'cus_1' })],
    'customers.deleteSource',
    ['cus_1', 'ba_1', undefined, opts],
  ),

  ...resource(services.ChargeService, 'charges', 'ch_1', [...CRUD]),
  call(
    services.ChargeService,
    'patch',
    ['ch_1', { capture: true, amount: 100 }, params()],
    'charges.capture',
    ['ch_1', { amount: 100 }, opts],
    'captures with { capture: true }',
  ),
  call(
    services.ChargeService,
    'remove',
    ['ch_1', params()],
    'refunds.create',
    [{ charge: 'ch_1' }, opts],
    'refunds the charge',
  ),

  ...resource(services.CheckoutSessionService, 'checkout.sessions', 'cs_1', [
    'find',
    'get',
    'create',
    'update',
  ]),
  call(
    services.CheckoutSessionService,
    'remove',
    ['cs_1', params()],
    'checkout.sessions.expire',
    ['cs_1', undefined, opts],
    'expires the session',
  ),

  ...resource(services.CouponService, 'coupons', 'co_1', [...CRUD]),
  call(services.CouponService, 'remove', ['co_1', params()], 'coupons.del', [
    'co_1',
    undefined,
    opts,
  ]),

  ...resource(
    services.CustomerPortalConfigurationService,
    'billingPortal.configurations',
    'bpc_1',
    [...CRUD],
  ),

  call(
    services.CustomerPortalSessionService,
    'create',
    [{ customer: 'cus_1' }, params()],
    'billingPortal.sessions.create',
    [{ customer: 'cus_1' }, opts],
  ),

  ...resource(services.CustomerService, 'customers', 'cus_1', [...CRUD]),
  call(
    services.CustomerService,
    'remove',
    ['cus_1', params()],
    'customers.del',
    ['cus_1', undefined, opts],
  ),
  call(
    services.CustomerService,
    'search',
    [params({ query: "email:'a@b.de'" })],
    'customers.search',
    [{ query: "email:'a@b.de'" }, opts],
  ),

  ...resource(services.DisputeService, 'disputes', 'dp_1', [
    'find',
    'get',
    'update',
    'patch',
  ]),

  ...resource(services.EventService, 'events', 'evt_1', ['find', 'get']),

  call(
    services.ExternalAccountService,
    'find',
    [params({ account: 'acct_1' })],
    'accounts.listExternalAccounts',
    ['acct_1', {}, opts],
  ),
  call(
    services.ExternalAccountService,
    'get',
    ['ba_1', params({ account: 'acct_1' })],
    'accounts.retrieveExternalAccount',
    ['acct_1', 'ba_1', undefined, opts],
  ),
  call(
    services.ExternalAccountService,
    'create',
    [{ account: 'acct_1', external_account: 'tok_1' }, params()],
    'accounts.createExternalAccount',
    ['acct_1', { external_account: 'tok_1' }, opts],
  ),
  call(
    services.ExternalAccountService,
    'update',
    ['ba_1', data, params({ account: 'acct_1' })],
    'accounts.updateExternalAccount',
    ['acct_1', 'ba_1', data, opts],
  ),
  call(
    services.ExternalAccountService,
    'patch',
    ['ba_1', data, params({ account: 'acct_1' })],
    'accounts.updateExternalAccount',
    ['acct_1', 'ba_1', data, opts],
  ),
  call(
    services.ExternalAccountService,
    'remove',
    ['ba_1', params({ account: 'acct_1' })],
    'accounts.deleteExternalAccount',
    ['acct_1', 'ba_1', undefined, opts],
  ),

  ...resource(services.InvoiceItemService, 'invoiceItems', 'ii_1', [...CRUD]),
  call(
    services.InvoiceItemService,
    'remove',
    ['ii_1', params()],
    'invoiceItems.del',
    ['ii_1', undefined, opts],
  ),

  ...resource(services.InvoiceService, 'invoices', 'in_1', [...CRUD]),
  call(
    services.InvoiceService,
    'patch',
    ['in_1', { pay: true }, params()],
    'invoices.pay',
    ['in_1', undefined, opts],
    'pays with { pay: true }',
  ),
  call(
    services.InvoiceService,
    'search',
    [params({ query: "status:'open'" })],
    'invoices.search',
    [{ query: "status:'open'" }, opts],
  ),

  ...resource(services.PaymentIntentService, 'paymentIntents', 'pi_1', [
    ...CRUD,
  ]),
  call(
    services.PaymentIntentService,
    'patch',
    ['pi_1', { capture: true, amount_to_capture: 500 }, params()],
    'paymentIntents.capture',
    ['pi_1', { amount_to_capture: 500 }, opts],
    'captures with { capture: true }',
  ),
  call(
    services.PaymentIntentService,
    'patch',
    ['pi_1', { confirm: true, payment_method: 'pm_1' }, params()],
    'paymentIntents.confirm',
    ['pi_1', { payment_method: 'pm_1' }, opts],
    'confirms with { confirm: true }',
  ),
  call(
    services.PaymentIntentService,
    'patch',
    ['pi_1', { cancel: true, cancellation_reason: 'abandoned' }, params()],
    'paymentIntents.cancel',
    ['pi_1', { cancellation_reason: 'abandoned' }, opts],
    'cancels with { cancel: true }',
  ),
  call(
    services.PaymentIntentService,
    'patch',
    ['pi_1', { capture: false, ...data }, params()],
    'paymentIntents.update',
    ['pi_1', data, opts],
    'updates with { capture: false }',
  ),

  ...resource(services.PaymentMethodService, 'paymentMethods', 'pm_1', [
    ...CRUD,
  ]),
  call(
    services.PaymentMethodService,
    'patch',
    ['pm_1', { attach: true, customer: 'cus_1' }, params()],
    'paymentMethods.attach',
    ['pm_1', { customer: 'cus_1' }, opts],
    'attaches with { attach: true }',
  ),
  call(
    services.PaymentMethodService,
    'remove',
    ['pm_1', params()],
    'paymentMethods.detach',
    ['pm_1', undefined, opts],
  ),

  ...resource(services.PayoutService, 'payouts', 'po_1', [...CRUD]),
  call(services.PayoutService, 'remove', ['po_1', params()], 'payouts.cancel', [
    'po_1',
    undefined,
    opts,
  ]),

  ...resource(services.PlanService, 'plans', 'plan_1', [...CRUD]),
  call(services.PlanService, 'remove', ['plan_1', params()], 'plans.del', [
    'plan_1',
    undefined,
    opts,
  ]),

  ...resource(services.PriceService, 'prices', 'price_1', [...CRUD]),

  ...resource(services.ProductService, 'products', 'prod_1', [...CRUD]),
  call(
    services.ProductService,
    'remove',
    ['prod_1', params()],
    'products.del',
    ['prod_1', undefined, opts],
  ),

  ...resource(services.RefundService, 'refunds', 're_1', [...CRUD]),

  ...resource(services.SetupIntentService, 'setupIntents', 'seti_1', [...CRUD]),

  ...resource(services.SourceService, 'sources', 'src_1', [
    'get',
    'create',
    'update',
    'patch',
  ]),
  call(
    services.SourceService,
    'create',
    [{ customer: 'cus_1', source: 'src_1' }, params()],
    'customers.createSource',
    ['cus_1', { source: 'src_1' }, opts],
    'attaches to a customer with { customer }',
  ),
  call(
    services.SourceService,
    'remove',
    ['src_1', params({ customer: 'cus_1' })],
    'customers.deleteSource',
    ['cus_1', 'src_1', undefined, opts],
  ),

  ...resource(services.SubscriptionItemService, 'subscriptionItems', 'si_1', [
    ...CRUD,
  ]),
  call(
    services.SubscriptionItemService,
    'remove',
    ['si_1', params()],
    'subscriptionItems.del',
    ['si_1', undefined, opts],
  ),

  ...resource(services.SubscriptionService, 'subscriptions', 'sub_1', [
    ...CRUD,
  ]),
  call(
    services.SubscriptionService,
    'remove',
    ['sub_1', params()],
    'subscriptions.cancel',
    ['sub_1', undefined, opts],
  ),

  ...resource(services.TokenService, 'tokens', 'tok_1', ['get', 'create']),

  call(
    services.TransferReversalService,
    'find',
    [params({ transfer: 'tr_1' })],
    'transfers.listReversals',
    ['tr_1', {}, opts],
  ),
  call(
    services.TransferReversalService,
    'get',
    ['trr_1', params({ transfer: 'tr_1' })],
    'transfers.retrieveReversal',
    ['tr_1', 'trr_1', undefined, opts],
  ),
  call(
    services.TransferReversalService,
    'create',
    [{ transfer: 'tr_1', amount: 100 }, params()],
    'transfers.createReversal',
    ['tr_1', { amount: 100 }, opts],
  ),
  call(
    services.TransferReversalService,
    'update',
    ['trr_1', data, params({ transfer: 'tr_1' })],
    'transfers.updateReversal',
    ['tr_1', 'trr_1', data, opts],
  ),
  call(
    services.TransferReversalService,
    'patch',
    ['trr_1', data, params({ transfer: 'tr_1' })],
    'transfers.updateReversal',
    ['tr_1', 'trr_1', data, opts],
  ),

  ...resource(services.TransferService, 'transfers', 'tr_1', [...CRUD]),
  call(
    services.TransferService,
    'remove',
    ['tr_1', params()],
    'transfers.createReversal',
    ['tr_1', undefined, opts],
    'reverses the transfer',
  ),

  ...resource(services.PromotionCodeService, 'promotionCodes', 'promo_1', [
    ...CRUD,
  ]),

  ...resource(
    services.SubscriptionScheduleService,
    'subscriptionSchedules',
    'sub_sched_1',
    [...CRUD],
  ),
  call(
    services.SubscriptionScheduleService,
    'remove',
    ['sub_sched_1', params()],
    'subscriptionSchedules.cancel',
    ['sub_sched_1', undefined, opts],
    'cancels the schedule',
  ),

  call(
    services.CustomerSessionService,
    'create',
    [{ customer: 'cus_1' }, params()],
    'customerSessions.create',
    [{ customer: 'cus_1' }, opts],
  ),

  ...resource(services.PaymentLinkService, 'paymentLinks', 'plink_1', [
    ...CRUD,
  ]),

  ...resource(services.TaxRateService, 'taxRates', 'txr_1', [...CRUD]),

  ...resource(services.CreditNoteService, 'creditNotes', 'cn_1', [...CRUD]),
  call(
    services.CreditNoteService,
    'remove',
    ['cn_1', params()],
    'creditNotes.voidCreditNote',
    ['cn_1', undefined, opts],
    'voids the credit note',
  ),

  ...resource(services.BillingMeterService, 'billing.meters', 'mtr_1', [
    ...CRUD,
  ]),
  call(
    services.BillingMeterService,
    'remove',
    ['mtr_1', params()],
    'billing.meters.deactivate',
    ['mtr_1', undefined, opts],
    'deactivates the meter',
  ),

  call(
    services.BillingMeterEventService,
    'create',
    [
      { event_name: 'api_call', payload: { stripe_customer_id: 'cus_1' } },
      params(),
    ],
    'billing.meterEvents.create',
    [
      { event_name: 'api_call', payload: { stripe_customer_id: 'cus_1' } },
      opts,
    ],
  ),
]

const serviceClasses = Object.entries(services).filter(
  ([name, value]) =>
    name.endsWith('Service') &&
    typeof value === 'function' &&
    name !== 'WebhookService',
) as [string, ServiceClass][]

describe('service methods call the right stripe method', () => {
  it.each(
    cases.map((c) => ({
      ...c,
      title: `${c.Service.name}.${c.method} -> stripe.${c.path}${c.name ? ` (${c.name})` : ''}`,
    })),
  )('$title', async ({ Service, method, args, path, expected }) => {
    const { stripe, calls } = createStripeMock()
    const service = new Service({ stripe })

    const result = await service[method](...args)

    expect(result).to.deep.equal({ id: 'result' })
    expect(calls).to.deep.equal([{ path, args: expected }])
  })
})

describe('unsupported methods reject with NotImplemented', () => {
  const implemented = new Map<ServiceClass, Set<Method>>()
  for (const c of cases) {
    if (!implemented.has(c.Service)) implemented.set(c.Service, new Set())
    implemented.get(c.Service)!.add(c.method)
  }

  const notImplemented = serviceClasses.flatMap(([name, Service]) =>
    METHODS.filter((m) => !implemented.get(Service)?.has(m)).map((method) => ({
      name,
      Service,
      method,
    })),
  )

  it.each(notImplemented)('$name.$method', async ({ Service, method }) => {
    const { stripe, calls } = createStripeMock()
    const service = new Service({ stripe })

    await expect(service[method]('id_1', {}, {})).rejects.toThrow(
      NotImplemented,
    )
    expect(calls).to.deep.equal([])
  })

  it('covers every exported service', () => {
    for (const [name, Service] of serviceClasses) {
      expect(implemented.has(Service), name).to.equal(true)
    }
  })
})

describe('expand', () => {
  const run = async (
    Service: ServiceClass,
    method: Method,
    args: any[],
  ): Promise<{ path: string; args: any[] }[]> => {
    const { stripe, calls } = createStripeMock()
    await new Service({ stripe })[method](...args)
    return calls
  }

  it('passes query.expand to retrieve', async () => {
    const calls = await run(services.CustomerService, 'get', [
      'cus_1',
      { stripe: opts, query: { expand: ['default_source'] } },
    ])

    expect(calls[0]!.args).to.deep.equal([
      'cus_1',
      { expand: ['default_source'] },
      opts,
    ])
  })

  it('accepts a single expand string', async () => {
    const calls = await run(services.CustomerService, 'get', [
      'cus_1',
      { query: { expand: 'default_source' } },
    ])

    expect(calls[0]!.args[1]).to.deep.equal({ expand: ['default_source'] })
  })

  it('moves the deprecated params.stripe.expand out of the request options', async () => {
    const calls = await run(services.CustomerService, 'get', [
      'cus_1',
      { stripe: { ...opts, expand: ['default_source'] } },
    ])

    expect(calls[0]!.args).to.deep.equal([
      'cus_1',
      { expand: ['default_source'] },
      opts,
    ])
  })

  it('only passes expand, not parent ids from the query', async () => {
    const calls = await run(services.BankAccountService, 'get', [
      'ba_1',
      { stripe: opts, query: { customer: 'cus_1', expand: ['customer'] } },
    ])

    expect(calls[0]!.args).to.deep.equal([
      'cus_1',
      'ba_1',
      { expand: ['customer'] },
      opts,
    ])
  })

  it('never sends expand as a request option', async () => {
    const calls = await run(services.CustomerService, 'create', [
      data,
      { stripe: { ...opts, expand: ['default_source'] } },
    ])

    expect(calls[0]!.args).to.deep.equal([data, opts])
  })

  it('passes query.expand to list on find', async () => {
    const calls = await run(services.CustomerService, 'find', [
      { stripe: opts, query: { expand: ['data.default_source'] } },
    ])

    expect(calls[0]!.args).to.deep.equal([
      { expand: ['data.default_source'] },
      opts,
    ])
  })
})

describe('missing parent ids reject with BadRequest', () => {
  const noParent = { stripe: opts }
  const missing: [ServiceClass, Method, any[]][] = [
    [services.ApplicationFeeRefundService, 'find', [params({})]],
    [services.ApplicationFeeRefundService, 'get', ['fr_1', noParent]],
    [services.ApplicationFeeRefundService, 'create', [data, noParent]],
    [services.ApplicationFeeRefundService, 'update', ['fr_1', data, noParent]],
    [services.BankAccountService, 'find', [params({})]],
    [services.BankAccountService, 'get', ['ba_1', params({})]],
    [services.BankAccountService, 'create', [data, params({})]],
    [services.BankAccountService, 'update', ['ba_1', data, params({})]],
    [services.BankAccountService, 'remove', ['ba_1', params({})]],
    [services.ExternalAccountService, 'find', [params({})]],
    [services.ExternalAccountService, 'get', ['ba_1', params({})]],
    [services.ExternalAccountService, 'create', [data, params()]],
    [services.ExternalAccountService, 'update', ['ba_1', data, params({})]],
    [services.ExternalAccountService, 'remove', ['ba_1', params({})]],
    [services.SourceService, 'remove', ['src_1', params({})]],
    [services.TransferReversalService, 'find', [params({})]],
    [services.TransferReversalService, 'get', ['trr_1', params({})]],
    [services.TransferReversalService, 'create', [data, params()]],
    [services.TransferReversalService, 'update', ['trr_1', data, params({})]],
  ]

  it.each(
    missing.map(([Service, method, args]) => ({
      title: `${Service.name}.${method}`,
      Service,
      method,
      args,
    })),
  )('$title', async ({ Service, method, args }) => {
    const { stripe, calls } = createStripeMock()
    const service = new Service({ stripe })

    await expect(service[method](...args)).rejects.toThrow(BadRequest)
    expect(calls).to.deep.equal([])
  })
})

describe('PaymentIntentService.patch', () => {
  it('rejects more than one action flag', async () => {
    const { stripe, calls } = createStripeMock()
    const service = new services.PaymentIntentService({ stripe })

    await expect(
      service.patch('pi_1', { capture: true, cancel: true } as any, params()),
    ).rejects.toThrow(BadRequest)
    expect(calls).to.deep.equal([])
  })
})

describe('stripe errors are converted', () => {
  it('rejects with a feathers error instead of the raw stripe error', async () => {
    const { Stripe } = await import('stripe')
    const service = new services.CustomerService({
      stripe: {
        customers: {
          retrieve: () =>
            Promise.reject(
              new Stripe.errors.StripeInvalidRequestError({
                message: 'No such customer',
              }),
            ),
        },
      } as any,
    })

    await expect(service.get('cus_1', params())).rejects.toThrow(BadRequest)
  })
})

describe('constructor', () => {
  it('requires a stripe instance', () => {
    expect(() => new services.CustomerService({} as any)).to.throw(
      'Stripe service option `stripe` needs to be provided',
    )
  })
})
