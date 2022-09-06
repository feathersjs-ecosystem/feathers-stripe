import Stripe from 'stripe';
import { ParamsWithStripe } from '../types';
import { BaseService } from './base';

export interface IRefundService {
  _find: (params: ParamsWithStripe) => Promise<Stripe.ApiList<Stripe.Refund>>;
  _get: (id: string, params: ParamsWithStripe) => Promise<Stripe.Refund>;
  _create: (data: Stripe.RefundCreateParams, params: ParamsWithStripe) => Promise<Stripe.Refund>;
  _update: (id: string, data: Stripe.RefundUpdateParams, params: ParamsWithStripe) => Promise<Stripe.Refund>;
  _patch: (id: string, data: Stripe.RefundUpdateParams, params: ParamsWithStripe) => Promise<Stripe.Refund>;
  _remove: never;
}

export class RefundService extends BaseService<IRefundService> implements IRefundService {
  _find (params) {
    const filtered = this.filterParams(params);
    return this.handlePaginate(
      filtered,
      this.stripe.refunds.list(filtered.query, filtered.stripe)
    );
  }

  _get (id: string, params: ParamsWithStripe) {
    const { stripe } = this.filterParams(params);
    return this.stripe.refunds.retrieve(id, stripe);
  }

  _create (data: Stripe.RefundCreateParams, params: ParamsWithStripe) {
    const { stripe } = this.filterParams(params);
    return this.stripe.refunds.create(data, stripe);
  }

  _update (id: string, data: Stripe.RefundUpdateParams, params: ParamsWithStripe) {
    const { stripe } = this.filterParams(params);
    return this.stripe.refunds.update(id, data, stripe);
  }

  _patch (id: string, data: Stripe.RefundUpdateParams, params: ParamsWithStripe) {
    return this._update(id, data, params);
  }

  _remove: never;
};
