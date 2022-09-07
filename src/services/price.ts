import type Stripe from 'stripe';
import type { FindMethod, ParamsWithStripe, ParamsWithStripeQuery } from '../types';
import { BaseService } from './base';

export interface IPriceService {
  _find: FindMethod<ParamsWithStripeQuery<Stripe.PriceListParams>, Stripe.Price>;
  _get: (id: string, params: ParamsWithStripe) => Promise<Stripe.Price>;
  _create: (data: Stripe.PriceCreateParams, params: ParamsWithStripe) => Promise<Stripe.Price>;
  _update: (id: string, data: Stripe.PriceUpdateParams, params: ParamsWithStripe) => Promise<Stripe.Price>;
  _patch: (id: string, data: Stripe.PriceUpdateParams, params: ParamsWithStripe) => Promise<Stripe.Price>;
  _remove: never
}

export class PriceService extends BaseService<IPriceService> implements IPriceService {
  _find (params: ParamsWithStripeQuery<Stripe.PriceListParams>) {
    const filtered = this.filterParams(params);
    return this.handlePaginate(
      filtered,
      this.stripe.prices.list(filtered.query, filtered.stripe)
    );
  }

  _get (id: string, params: ParamsWithStripe) {
    const { stripe } = this.filterParams(params);
    return this.stripe.prices.retrieve(id, stripe);
  }

  _create (data: Stripe.PriceCreateParams, params: ParamsWithStripe) {
    const { stripe } = this.filterParams(params);
    return this.stripe.prices.create(data, stripe);
  }

  _update (id: string, data: Stripe.PriceUpdateParams, params: ParamsWithStripe) {
    const { stripe } = this.filterParams(params);
    return this.stripe.prices.update(id, data, stripe);
  }

  _patch (id: string, data: Stripe.PriceUpdateParams, params: ParamsWithStripe) {
    return this._update(id, data, params);
  }

  _remove: never
}
