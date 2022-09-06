import Stripe from 'stripe';
import { ParamsWithStripe } from '../types';
import { BaseService } from './base';

export interface ISubscriptionItemService {
  _find: (params: ParamsWithStripe) => Promise<Stripe.ApiList<Stripe.SubscriptionItem>>;
  _get: (id: string, params: ParamsWithStripe) => Promise<Stripe.SubscriptionItem>;
  _create: (data: Stripe.SubscriptionItemCreateParams, params: ParamsWithStripe) => Promise<Stripe.SubscriptionItem>;
  _update: (id: string, data: Stripe.SubscriptionItemUpdateParams, params: ParamsWithStripe) => Promise<Stripe.SubscriptionItem>;
  _patch: (id: string, data: Stripe.SubscriptionItemUpdateParams, params: ParamsWithStripe) => Promise<Stripe.SubscriptionItem>;
  _remove: (id: string, params: ParamsWithStripe) => Promise<Stripe.DeletedSubscriptionItem>;
}

export class SubscriptionItemService extends BaseService<ISubscriptionItemService> implements ISubscriptionItemService {
  _find (params) {
    const filtered = this.filterParams(params);
    return this.handlePaginate(
      filtered,
      this.stripe.subscriptionItems.list(filtered.query, filtered.stripe)
    );
  }

  _get (id: string, params: ParamsWithStripe) {
    const { stripe } = this.filterParams(params);
    return this.stripe.subscriptionItems.retrieve(id, stripe);
  }

  _create (data: Stripe.SubscriptionItemCreateParams, params: ParamsWithStripe) {
    const { stripe } = this.filterParams(params);
    return this.stripe.subscriptionItems.create(data, stripe);
  }

  _update (id: string, data: Stripe.SubscriptionItemUpdateParams, params: ParamsWithStripe) {
    const { stripe } = this.filterParams(params);
    return this.stripe.subscriptionItems.update(id, data, stripe);
  }

  _patch (id: string, data: Stripe.SubscriptionItemUpdateParams, params: ParamsWithStripe) {
    return this._update(id, data, params);
  }

  _remove (id: string, params: ParamsWithStripe) {
    const { stripe } = this.filterParams(params);
    return this.stripe.subscriptionItems.del(id, stripe);
  }
};
