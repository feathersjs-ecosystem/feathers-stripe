import makeDebug from 'debug';
import type Stripe from 'stripe';
import type { FindMethod, ParamsWithStripeFee, ParamsWithStripeQuery } from '../types';
import { BaseService } from './base';

const debug = makeDebug('feathers-stripe:application-fee-refund');

export interface IApplicationFeeRefundService {
  _find: FindMethod<ParamsWithStripeQuery<Stripe.ApplicationFeeListParams & { fee: string }>, Stripe.FeeRefund>;
  _get: (id: string, params: ParamsWithStripeFee) => Promise<Stripe.FeeRefund>;
  _create: (data: Stripe.FeeRefundCreateParams, params: ParamsWithStripeFee) => Promise<Stripe.FeeRefund>;
  _update: (id: string, data: Stripe.FeeRefundUpdateParams, params: ParamsWithStripeFee) => Promise<Stripe.FeeRefund>;
  _patch: (id: string, data: Stripe.FeeRefundUpdateParams, params: ParamsWithStripeFee) => Promise<Stripe.FeeRefund>;
  _remove: never
}

export class ApplicationFeeRefundService extends BaseService<IApplicationFeeRefundService> implements IApplicationFeeRefundService {
  _find (params: ParamsWithStripeQuery<Stripe.ApplicationFeeListParams & { fee: string }>) {
    const filtered = this.filterParams(params);
    if (!filtered.query.fee) {
      debug('Missing Stripe fee id');
    }
    const { fee, ...query } = filtered.query;
    return this.handlePaginate(
      filtered,
      this.stripe.applicationFees.listRefunds(fee, query, filtered.stripe)
    );
  }

  _get (id: string, params: ParamsWithStripeFee) {
    const { stripe } = this.filterParams(params);
    if (!stripe.fee) {
      debug('Missing Stripe fee id');
    }
    const { fee, ...rest } = stripe;
    return this.stripe.applicationFees.retrieveRefund(fee, id, rest);
  }

  _create (data: Stripe.FeeRefundCreateParams, params: ParamsWithStripeFee) {
    const { stripe } = this.filterParams(params);
    if (!stripe.fee) {
      debug('Missing Stripe fee id');
    }
    const { fee, ...rest } = stripe;
    return this.stripe.applicationFees.createRefund(fee, data, rest);
  }

  _update (id: string, data: Stripe.FeeRefundUpdateParams, params: ParamsWithStripeFee) {
    const { stripe } = this.filterParams(params);
    if (!stripe.fee) {
      debug('Missing Stripe fee id');
    }
    const { fee, ...rest } = stripe;
    return this.stripe.applicationFees.updateRefund(fee, id, data, rest);
  }

  _patch (id: string, data: Stripe.FeeRefundUpdateParams, params: ParamsWithStripeFee) {
    return this._update(id, data, params);
  }

  _remove: never
}
