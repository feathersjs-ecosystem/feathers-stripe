import type { AddressInfo } from 'node:net'
import type { Server } from 'node:http'
import { expect, vi } from 'vitest'
import { feathers } from '@feathersjs/feathers'
import feathersExpress, { json, rest } from '@feathersjs/express'
import { Stripe } from 'stripe'
import { setupWebhook, type WebHookHandler } from '../src/index.js'

const secret = 'whsec_test_secret'
const route = '/stripe/webhook'

describe('setupWebhook (express)', () => {
  const stripe = new Stripe('sk_test_123')
  const created = vi.fn<WebHookHandler>(() => ({ handled: true }))
  let server: Server
  let url: string

  beforeAll(async () => {
    // @feathersjs/express is CJS, `.default` is the express factory
    const app = feathersExpress.default(feathers())
    app.use(
      json({
        verify: (req: any, _res, buf) => {
          req.rawBody = buf
        },
      }),
    )
    app.configure(rest())

    setupWebhook(app, route, {
      endpointSecret: secret,
      stripe,
      handlers: { customer: { created } },
    })

    server = await app.listen(0)
    url = `http://localhost:${(server.address() as AddressInfo).port}${route}`
  })

  afterAll(() => {
    server?.close()
  })

  beforeEach(() => created.mockClear())

  const event = {
    id: 'evt_1',
    object: 'event',
    type: 'customer.created',
    data: { object: { id: 'cus_1', object: 'customer' } },
  }

  const post = (body: string, headers: Record<string, string> = {}) =>
    fetch(url, {
      method: 'POST',
      headers: { 'content-type': 'application/json', ...headers },
      body,
    })

  it('calls the handler for a correctly signed event', async () => {
    const payload = JSON.stringify(event)
    const signature = stripe.webhooks.generateTestHeaderString({
      payload,
      secret,
    })

    const res = await post(payload, { 'stripe-signature': signature })

    expect(res.status).to.equal(201)
    expect(await res.json()).to.deep.equal({ handled: true })
    expect(created).toHaveBeenCalledOnce()
    expect(created.mock.calls[0]![0]).toMatchObject({
      object: event.data.object,
      event,
    })
  })

  it('rejects requests without a signature', async () => {
    const res = await post(JSON.stringify(event))

    expect(res.status).to.equal(400)
    expect(created).not.toHaveBeenCalled()
  })

  it('rejects requests with an invalid signature', async () => {
    const payload = JSON.stringify(event)
    const signature = stripe.webhooks.generateTestHeaderString({
      payload,
      secret: 'whsec_wrong',
    })

    const res = await post(payload, { 'stripe-signature': signature })

    expect(res.status).to.equal(400)
    expect(await res.text()).to.contain('signature verification failed')
    expect(created).not.toHaveBeenCalled()
  })

  it('rejects a tampered payload', async () => {
    const payload = JSON.stringify(event)
    const signature = stripe.webhooks.generateTestHeaderString({
      payload,
      secret,
    })

    const res = await post(
      JSON.stringify({ ...event, type: 'customer.deleted' }),
      { 'stripe-signature': signature },
    )

    expect(res.status).to.equal(400)
    expect(created).not.toHaveBeenCalled()
  })
})

describe('setupWebhook (express) without rawBody', () => {
  const stripe = new Stripe('sk_test_123')
  let server: Server
  let url: string

  beforeAll(async () => {
    const app = feathersExpress.default(feathers())
    app.use(json())
    app.configure(rest())
    setupWebhook(app, route, { endpointSecret: secret, stripe, handlers: {} })

    server = await app.listen(0)
    url = `http://localhost:${(server.address() as AddressInfo).port}${route}`
  })

  afterAll(() => {
    server?.close()
  })

  it('responds with a helpful error', async () => {
    const payload = JSON.stringify({ type: 'customer.created' })
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'stripe-signature': stripe.webhooks.generateTestHeaderString({
          payload,
          secret,
        }),
      },
      body: payload,
    })

    expect(res.status).to.equal(500)
    expect(await res.text()).to.contain('rawBody')
  })
})
