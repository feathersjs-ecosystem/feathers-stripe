import Stripe from 'stripe';
import { ParamsWithStripe } from '../types';
import { BaseService } from './base';

export interface ICouponService {
  _find: (params: ParamsWithStripe) => Promise<Stripe.ApiListPromise<Stripe.Coupon>>;
  _get: (id: string, params: ParamsWithStripe) => Promise<Stripe.Coupon>;
  _create: (data: Stripe.CouponCreateParams, params: ParamsWithStripe) => Promise<Stripe.Coupon>;
  _update: (id: string, data: Stripe.CouponUpdateParams, params: ParamsWithStripe) => Promise<Stripe.Coupon>;
  _patch: (id: string, data: Stripe.CouponUpdateParams, params: ParamsWithStripe) => Promise<Stripe.Coupon>;
  _remove: never
}

export class CouponService extends BaseService<ICouponService> implements ICouponService {
  _find (params) {
    const filtered = this.filterParams(params);
    return this.handlePaginate(
      filtered,
      this.stripe.coupons.list(filtered.query, filtered.stripe)
    );
  }

  _get (id: string, params: ParamsWithStripe) {
    const { stripe } = this.filterParams(params);
    return this.stripe.coupons.retrieve(id, stripe);
  }

  _create (data: Stripe.CouponCreateParams, params: ParamsWithStripe) {
    const { stripe } = this.filterParams(params);
    return this.stripe.coupons.create(data, stripe);
  }

  _update (id: string, data: Stripe.CouponUpdateParams, params: ParamsWithStripe) {
    const { stripe } = this.filterParams(params);
    return this.stripe.coupons.update(id, data, stripe);
  }

  _patch (id: string, data: Stripe.CouponUpdateParams, params: ParamsWithStripe) {
    return this._update(id, data, params);
  }

  _remove: never
};
