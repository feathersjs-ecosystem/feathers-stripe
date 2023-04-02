// Heavily inspired from https://github.com/fixate/feathers-stripe-webhooks
import { BaseService } from "./base";

import type { Application, Params } from "@feathersjs/feathers";
import type Stripe from "stripe";
import type { Application as ExpressApplication } from "@feathersjs/express";
import type { NextFunction, Request, Response } from "express";

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

export interface WebHookHandlers {
  [key: string]: {
    [key: string]: WebHookHandler;
  };
}

export interface WebHookOptions {
  app: Application;
  handlers: WebHookHandlers;
  stripe: Stripe;
}

export class WebhookService
  extends BaseService<IWebhookService>
  implements IWebhookService
{
  app: Application;
  handlers: WebHookHandlers;
  declare options: WebHookOptions;

  isExpressSetup = false;

  constructor(options: WebHookOptions) {
    super(options);

    if (!options.app) {
      throw new Error("options.app is required");
    }

    this.app = options.app;
    this.handlers = options.handlers || {};
    this.options = options;
  }

  /**
   * registers an express route
   * @param route
   * @param endpointSecret
   * @returns
   */
  setupExpress(route: string, endpointSecret: string) {
    if (this.isExpressSetup) {
      return;
    }

    (this.app as ExpressApplication).post(
      route,
      (req: Request, res: Response, next: NextFunction) => {
        const signature = req.headers["stripe-signature"];
        if (!signature) {
          res.status(400).end("Bad signature");
          return;
        }

        try {
          this.stripe.webhooks.constructEvent(
            // @ts-expect-error
            req.rawBody,
            signature,
            endpointSecret
          );
        } catch (err) {
          res.status(400).end(err);
          return;
        }

        next();
      }
    );

    this.isExpressSetup = true;
  }

  getHandler(event: Stripe.Event): WebHookHandler | null {
    const parts = event.type.split(".");
    let node = this.handlers;

    for (const p of parts) {
      // @ts-ignore
      node = node[parts[p]];

      if (!node) {
        return null;
      }
    }

    return node as any as WebHookHandler;
  }

  _create(event: Stripe.Event, params: Params) {
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
}

export type SetupWebHookOptions = {
  endpointSecret: string;
  stripe: Stripe;
  handlers: WebHookHandlers;
};

export function setupWebhook(
  app: Application,
  route: string,
  { endpointSecret, stripe, handlers }: SetupWebHookOptions
) {
  const service = new WebhookService({
    handlers,
    stripe,
    app
  });

  service.setupExpress(route, endpointSecret);

  return service;
}
