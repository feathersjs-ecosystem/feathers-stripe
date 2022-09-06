import Stripe from 'stripe';
import { ParamsWithStripe } from '../types';
import { BaseService } from './base';

export interface ISubscriptionService {
  _find: (params: ParamsWithStripe) => Promise<Stripe.ApiList<Stripe.Subscription>>;
  _get: (id: string, params: ParamsWithStripe) => Promise<Stripe.Subscription>;
  _create: (data: Stripe.SubscriptionCreateParams, params: ParamsWithStripe) => Promise<Stripe.Subscription>;
  _update: (id: string, data: Stripe.SubscriptionUpdateParams, params: ParamsWithStripe) => Promise<Stripe.Subscription>;
  _patch: (id: string, data: Stripe.SubscriptionUpdateParams, params: ParamsWithStripe) => Promise<Stripe.Subscription>;
  _remove: (id: string, params: ParamsWithStripe) => Promise<Stripe.Subscription>;
}

export class SubscriptionService extends BaseService<ISubscriptionService> implements ISubscriptionService {
  _find (params) {
    const filtered = this.filterParams(params);
    return this.handlePaginate(
      filtered,
      this.stripe.subscriptions.list(filtered.query, filtered.stripe)
    );
  }

  _get (id: string, params: ParamsWithStripe) {
    const { stripe } = this.filterParams(params);
    return this.stripe.subscriptions.retrieve(id, stripe);
  }

  _create (data: Stripe.SubscriptionCreateParams, params: ParamsWithStripe) {
    const { stripe } = this.filterParams(params);
    return this.stripe.subscriptions.create(data, stripe);
  }

  _update (id: string, data: Stripe.SubscriptionUpdateParams, params: ParamsWithStripe) {
    const { stripe } = this.filterParams(params);
    return this.stripe.subscriptions.update(id, data, stripe);
  }

  _patch (id: string, data: Stripe.SubscriptionUpdateParams, params: ParamsWithStripe) {
    return this._update(id, data, params);
  }

  _remove (id: string, params: ParamsWithStripe) {
    const { stripe } = this.filterParams(params);
    return this.stripe.subscriptions.del(id, stripe);
  }
};
