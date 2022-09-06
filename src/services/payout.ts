import Stripe from 'stripe';
import { ParamsWithStripe } from '../types';
import { BaseService } from './base';

export interface IPayoutService {
  _find: (params: ParamsWithStripe) => Promise<Stripe.Payout[]>;
  _get: (id: string, params: ParamsWithStripe) => Promise<Stripe.Payout>;
  _create: (data: Stripe.PayoutCreateParams, params: ParamsWithStripe) => Promise<Stripe.Payout>;
  _update: (id: string, data: Stripe.PayoutUpdateParams, params: ParamsWithStripe) => Promise<Stripe.Payout>;
  _patch: (id: string, data: Stripe.PayoutUpdateParams, params: ParamsWithStripe) => Promise<Stripe.Payout>;
  _remove: (id: string, params: ParamsWithStripe) => Promise<Stripe.Payout>;
}

export class PayoutService extends BaseService<IPayoutService> implements IPayoutService {
  _find (params) {
    const filtered = this.filterParams(params);
    return this.handlePaginate(
      filtered,
      this.stripe.payouts.list(filtered.query, filtered.stripe)
    );
  }

  _get (id: string, params: ParamsWithStripe) {
    const { stripe } = this.filterParams(params);
    return this.stripe.payouts.retrieve(id, stripe);
  }

  _create (data: Stripe.PayoutCreateParams, params: ParamsWithStripe) {
    const { stripe } = this.filterParams(params);
    return this.stripe.payouts.create(data, stripe);
  }

  _update (id: string, data: Stripe.PayoutUpdateParams, params: ParamsWithStripe) {
    const { stripe } = this.filterParams(params);
    return this.stripe.payouts.update(id, data, stripe);
  }

  _patch (id: string, data: Stripe.PayoutUpdateParams, params: ParamsWithStripe) {
    return this._update(id, data, params);
  }

  _remove (id: string, params: ParamsWithStripe) {
    const { stripe } = this.filterParams(params);
    return this.stripe.payouts.cancel(id, stripe);
  }
};
