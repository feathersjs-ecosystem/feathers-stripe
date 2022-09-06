import Stripe from 'stripe';
import { ParamsWithStripe } from '../types';
import { BaseService } from './base';

export interface IDisputeService {
  _find: (params: ParamsWithStripe) => Promise<Stripe.ApiList<Stripe.Dispute>>;
  _get: (id: string, params: ParamsWithStripe) => Promise<Stripe.Dispute>;
  _create: never;
  _update: (id: string, data: Stripe.DisputeUpdateParams, params: ParamsWithStripe) => Promise<Stripe.Dispute>;
  _patch: (id: string, data: Stripe.DisputeUpdateParams, params: ParamsWithStripe) => Promise<Stripe.Dispute>;
  _remove: never;
}

export class DisputeService extends BaseService<IDisputeService> implements IDisputeService {
  _find (params) {
    const filtered = this.filterParams(params);
    return this.handlePaginate(
      filtered,
      this.stripe.disputes.list(filtered.query, filtered.stripe)
    );
  }

  _get (id: string, params: ParamsWithStripe) {
    const { stripe } = this.filterParams(params);
    return this.stripe.disputes.retrieve(id, stripe);
  }

  _update (id: string, data: Stripe.DisputeUpdateParams, params: ParamsWithStripe) {
    const { stripe } = this.filterParams(params);
    return this.stripe.disputes.update(id, data, stripe);
  }

  _patch (id: string, data: Stripe.DisputeUpdateParams, params: ParamsWithStripe) {
    return this._update(id, data, params);
  }

  _create: never;
  _remove: never;
};
