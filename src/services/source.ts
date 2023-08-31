import makeDebug from "debug";
import type Stripe from "stripe";
import type { ParamsWithStripe, ParamsWithStripeQuery } from "../types";
import { BaseService } from "./base";

const debug = makeDebug("feathers-stripe:source");

export interface ISourceService {
  _find: never;
  _get: (id: string, params: ParamsWithStripe) => Promise<Stripe.Source>;
  _create:
    ((data: { customer: string } & Stripe.CustomerSourceCreateParams, params: ParamsWithStripe) => Promise<Stripe.CustomerSource>) |
    ((data: Stripe.SourceCreateParams, params: ParamsWithStripe) => Promise<Stripe.Source>);
  _update: (id: string, data: Stripe.SourceUpdateParams, params: ParamsWithStripe) => Promise<Stripe.Source>;
  _patch: (id: string, data: Stripe.SourceUpdateParams, params: ParamsWithStripe) => Promise<Stripe.Source>;
  _remove: (id: string, params: ParamsWithStripeQuery<{ customer: string }>) => Promise<Stripe.CustomerSource | Stripe.DeletedBankAccount | Stripe.DeletedCard>;
}

export class SourceService extends BaseService<ISourceService> implements ISourceService {
  _find: never;

  _get (id: string, params: ParamsWithStripe) {
    const { stripe } = this.filterParams(params);
    return this.stripe.sources.retrieve(id, stripe);
  }

  _create (data: { customer: string } & Stripe.CustomerSourceCreateParams, params: ParamsWithStripe): Promise<Stripe.CustomerSource>;
  _create (data: Stripe.SourceCreateParams, params: ParamsWithStripe): Promise<Stripe.Source>;
  _create (data: ({ customer: string } & Stripe.CustomerSourceCreateParams) | Stripe.SourceCreateParams, params: ParamsWithStripe): Promise<Stripe.CustomerSource | Stripe.Source> {
    const { stripe } = this.filterParams(params);
    if ("customer" in data) {
      const { customer, ...rest } = data;
      if (customer) {
        return this.stripe.customers.createSource(customer, rest as Stripe.CustomerSourceCreateParams, stripe);
      }
    }
    return this.stripe.sources.create(data, stripe);
  }

  _update (id: string, data: Stripe.SourceUpdateParams, params: ParamsWithStripe) {
    const { stripe } = this.filterParams(params);
    return this.stripe.sources.update(id, data, stripe);
  }

  _patch (id: string, data: Stripe.SourceUpdateParams, params: ParamsWithStripe) {
    return this._update(id, data, params);
  }

  _remove (id: string, params: ParamsWithStripeQuery<{ customer: string }>) {
    const { query, stripe } = this.filterParams(params);
    if (!query.customer) {
      debug("Missing Stripe customer id");
    }
    return this.stripe.customers.deleteSource(query.customer, id, stripe);
  }
}
