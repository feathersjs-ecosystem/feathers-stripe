import type Stripe from 'stripe';
import type { FindMethod, ParamsWithStripe, ParamsWithStripeQuery } from '../types';
import { BaseService } from './base';

export interface ISkuService {
  _find: FindMethod<ParamsWithStripeQuery<Stripe.SkuListParams>, Stripe.Sku>;
  _get: (id: string, params: ParamsWithStripe) => Promise<Stripe.Sku | Stripe.DeletedSku>;
  _create: (data: Stripe.SkuCreateParams, params: ParamsWithStripe) => Promise<Stripe.Sku>;
  _update: (id: string, data: Stripe.SkuUpdateParams, params: ParamsWithStripe) => Promise<Stripe.Sku>;
  _patch: (id: string, data: Stripe.SkuUpdateParams, params: ParamsWithStripe) => Promise<Stripe.Sku>;
  _remove: (id: string, params: ParamsWithStripe) => Promise<Stripe.DeletedSku>;
}

export class SkuService extends BaseService<ISkuService> implements ISkuService {
  _find (params: ParamsWithStripeQuery<Stripe.SkuListParams>) {
    const filtered = this.filterParams(params);
    return this.handlePaginate(
      filtered,
      this.stripe.skus.list(filtered.query, filtered.stripe)
    );
  }

  _get (id: string, params: ParamsWithStripe) {
    const { stripe } = this.filterParams(params);
    return this.stripe.skus.retrieve(id, stripe);
  }

  _create (data: Stripe.SkuCreateParams, params: ParamsWithStripe) {
    const { stripe } = this.filterParams(params);
    return this.stripe.skus.create(data, stripe);
  }

  _update (id: string, data: Stripe.SkuUpdateParams, params: ParamsWithStripe) {
    const { stripe } = this.filterParams(params);
    return this.stripe.skus.update(id, data, stripe);
  }

  _patch (id: string, data: Stripe.SkuUpdateParams, params: ParamsWithStripe): Promise<Stripe.Sku> {
    return this._update(id, data, params);
  }

  _remove (id: string, params: ParamsWithStripe) {
    const { stripe } = this.filterParams(params);
    return this.stripe.skus.del(id, stripe);
  }
}
