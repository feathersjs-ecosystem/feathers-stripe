import Stripe from 'stripe';
import { ParamsWithStripe } from '../types';
import { BaseService } from './base';

export interface IChargeService {
  _find: (params: ParamsWithStripe) => Promise<Stripe.ApiListPromise<Stripe.Charge>>;
  _get: (id: string, params: ParamsWithStripe) => Promise<Stripe.Charge>;
  _create: (data: Stripe.ChargeCreateParams, params: ParamsWithStripe) => Promise<Stripe.Charge>;
  _update: (id: string, data: Stripe.ChargeUpdateParams, params: ParamsWithStripe) => Promise<Stripe.Charge>;
  _patch:
    ((id: string, data: {capture: boolean } & Stripe.ChargeCaptureParams, params: ParamsWithStripe) => Promise<Stripe.Charge>) |
    ((id: string, data: Stripe.ChargeUpdateParams, params: ParamsWithStripe) => Promise<Stripe.Charge>)
  _remove: (id: string, params: ParamsWithStripe) => Promise<Stripe.Refund>;
}

export class ChargeService extends BaseService<IChargeService> implements IChargeService {
  _find (params) {
    const filtered = this.filterParams(params);
    return this.handlePaginate(
      filtered,
      this.stripe.charges.list(filtered.query, filtered.stripe)
    );
  }

  _get (id: string, params: ParamsWithStripe) {
    const { stripe } = this.filterParams(params);
    return this.stripe.charges.retrieve(id, stripe);
  }

  _create (data: Stripe.ChargeCreateParams, params: ParamsWithStripe) {
    const { stripe } = this.filterParams(params);
    return this.stripe.charges.create(data, stripe);
  }

  _update (id: string, data: Stripe.ChargeUpdateParams, params: ParamsWithStripe) {
    const { stripe } = this.filterParams(params);
    return this.stripe.charges.update(id, data, stripe);
  }

  _patch (id: string, data: {capture: boolean } & Stripe.ChargeCaptureParams, params: ParamsWithStripe)
  _patch (id: string, data: Stripe.ChargeUpdateParams, params: ParamsWithStripe)
  _patch (id: string, data: ({capture: boolean } & Stripe.ChargeCaptureParams) | Stripe.ChargeUpdateParams, params: ParamsWithStripe) {
    const { stripe } = this.filterParams(params);
    if ("capture" in data) {
      const { capture, ...rest } = data;
      if (capture) {
        return this.stripe.charges.capture(id, rest, stripe);
      }
    }
    return this._update(id, data, params);
  }

  _remove (id: string, params: ParamsWithStripe) {
    const { stripe } = this.filterParams(params);
    return this.stripe.refunds.create({ charge: id }, stripe);
  }
};
