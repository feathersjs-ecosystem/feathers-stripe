// Heavily inspired from https://github.com/fixate/feathers-stripe-webhooks
import { NotAuthenticated } from '@feathersjs/errors'
import { BaseService } from './base.js'

import type { Application, Params } from '@feathersjs/feathers'
import type { Stripe } from 'stripe'
import type {} from '@feathersjs/express'

export interface IWebhookService {
  _find: never
  _get: never
  _create: (data: any, params: any) => Promise<any>
  _update: never
  _patch: never
  _remove: never
}

export type WebHookHandler = (options: {
  object: Stripe.Event.Data.Object
  event: Stripe.Event
  params: Params
  app: Application
}) => any

export interface WebHookHandlers {
  [key: string]: {
    [key: string]:
      | WebHookHandler
      | {
          [key: string]:
            | WebHookHandler
            | {
                [key: string]: WebHookHandler
              }
        }
  }
}

/** The parts of an express request `verifySignature` relies on */
export interface WebhookRequest {
  headers: Record<string, string | string[] | undefined>
  rawBody?: Buffer | string
  feathers?: Record<string, any>
}

/** The parts of an express response `verifySignature` relies on */
export interface WebhookResponse {
  status: (code: number) => { end: (body: string) => unknown }
}

export interface WebHookOptions {
  app: Application
  handlers: WebHookHandlers
  stripe: Stripe
}

export class WebhookService
  extends BaseService<IWebhookService>
  implements IWebhookService
{
  app: Application
  handlers: WebHookHandlers
  declare options: WebHookOptions

  constructor(options: WebHookOptions) {
    super(options)

    if (!options.app) {
      throw new Error('options.app is required')
    }

    this.app = options.app
    this.handlers = options.handlers || {}
    this.options = options
  }

  /**
   * Express middleware that verifies the `stripe-signature` header against
   * the raw request body and passes the verified event on as
   * `params.stripeEvent`.
   *
   * Requires `req.rawBody`, e.g. via
   * `express.json({ verify: (req, res, buf) => { req.rawBody = buf } })`.
   */
  verifySignature(endpointSecret: string) {
    return (req: WebhookRequest, res: WebhookResponse, next: () => void) => {
      const signature = req.headers['stripe-signature']
      if (!signature) {
        res.status(400).end('Missing stripe-signature header')
        return
      }

      const { rawBody } = req
      if (!rawBody) {
        res
          .status(500)
          .end(
            'Missing req.rawBody. Configure express.json({ verify }) to keep the raw body for stripe webhooks.',
          )
        return
      }

      try {
        const stripeEvent = this.stripe.webhooks.constructEvent(
          rawBody,
          signature,
          endpointSecret,
        )
        req.feathers = { ...req.feathers, stripeEvent }
      } catch (error: any) {
        res
          .status(400)
          .end(`Webhook signature verification failed: ${error.message}`)
        return
      }

      next()
    }
  }

  getHandler(event: Stripe.Event): WebHookHandler | null {
    const parts = event.type.split('.')
    let node: any = this.handlers

    for (const p of parts) {
      node = node[p]

      if (!node) {
        return null
      }
    }

    return typeof node === 'function' ? node : null
  }

  async _create(
    data: Stripe.Event,
    params: Params & { stripeEvent?: Stripe.Event } = {},
  ) {
    // External calls must come through `verifySignature`, which provides the
    // verified event. The request body itself is never trusted.
    if (params.provider && !params.stripeEvent) {
      throw new NotAuthenticated('Stripe webhook signature was not verified')
    }
    const event: Stripe.Event = params.stripeEvent ?? data

    const handler = this.getHandler(event)
    if (!handler) {
      // No handler, nothing to do
      return {}
    }

    return handler({ object: event.data.object, event, params, app: this.app })
  }

  declare _find: never
  declare _get: never
  declare _update: never
  declare _patch: never
  declare _remove: never
}

export type SetupWebHookOptions = {
  endpointSecret: string
  stripe: Stripe
  handlers: WebHookHandlers
}

/**
 * Registers a `WebhookService` at `route` that only accepts `create` and
 * verifies the stripe signature of every external request.
 */
export function setupWebhook(
  app: Application,
  route: string,
  { endpointSecret, stripe, handlers }: SetupWebHookOptions,
) {
  const service = new WebhookService({
    handlers,
    stripe,
    app,
  })

  app.use(route, service as any, {
    methods: ['create'],
    express: { before: [service.verifySignature(endpointSecret)] },
  })

  // the registered service is a feathers wrapper (with hooks) around `service`
  return app.service(route) as unknown as WebhookService
}
