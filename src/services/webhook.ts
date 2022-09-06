// Heavily inspired from https://github.com/fixate/feathers-stripe-webhooks
import { BaseService } from './base';

import { Application, Params } from "@feathersjs/feathers";
import Stripe from 'stripe';

export interface IWebhookService {
  _find: never;
  _get: never;
  _create: (data: any, params: any) => Promise<any>;
  _update: never;
  _patch: never;
  _remove: never;
}

export type WebHookHandler = (options: {
  object: Stripe.Event.Data.Object;
  event: Stripe.Event;
  params: Params;
  app: Application;
}) => any;

interface Handlers {
  [key: string]: {
    [key: string]: WebHookHandler;
  };
}

interface WebHookOptions {
  app: Application
  handlers: Handlers
  route: string
  endpointSecret: any
  secretKey: string
}

export class WebhookService extends BaseService<IWebhookService> implements IWebhookService {
  app: Application
  handlers: Handlers;

  constructor (options: WebHookOptions) {
    super(options);

    if (!options.app) {
      throw new Error('options.app is required');
    }

    this.app = options.app;
    this.handlers = options.handlers || {};

    // @ts-ignore
    this.app.post(options.route, (req, res, next) => {
      const signature = req.headers['stripe-signature'];
      if (!signature) {
        res.status(400).end('Bad signature');
        return;
      }

      try {
        this.stripe.webhooks.constructEvent(req.rawBody, signature, options.endpointSecret);
      } catch (err) {
        res.status(400).end(err);
        return;
      }

      next();
    });
  }

  getHandler (event: Stripe.Event): WebHookHandler | null {
    const parts = event.type.split('.');
    let node = this.handlers;

    for (const p in parts) {
      // @ts-ignore
      node = node[parts[p]];

      if (!node) { return null; }
    }

    return node as any as WebHookHandler;
  }

  _create (event: Stripe.Event, params: Params) {
    const handler = this.getHandler(event);
    if (!handler) {
      // No handler, nothing to do
      return Promise.resolve({});
    }

    return handler({ object: event.data.object, event, params, app: this.app });
  }

  _find: never;
  _get: never;
  _update: never;
  _patch: never;
  _remove: never;
};
