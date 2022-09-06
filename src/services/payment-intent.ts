import Stripe from 'stripe';
import { ParamsWithStripe } from '../types';
import { BaseService } from './base';

export interface IPaymentIntentService {
  _find: (params: ParamsWithStripe) => Promise<Stripe.ApiListPromise<Stripe.PaymentIntent>>;
  _get: (id: string, params: ParamsWithStripe) => Promise<Stripe.PaymentIntent>;
  _create: (data: Stripe.PaymentIntentCreateParams, params: ParamsWithStripe) => Promise<Stripe.PaymentIntent>;
  _update: (id: string, data: Stripe.PaymentIntentUpdateParams, params: ParamsWithStripe) => Promise<Stripe.PaymentIntent>;
  _patch: (id: string, data: Stripe.PaymentIntentUpdateParams, params: ParamsWithStripe) => Promise<Stripe.PaymentIntent>;
  _remove: never
}

export class PaymentIntentService extends BaseService<IPaymentIntentService> implements IPaymentIntentService {
  _find (params) {
    const filtered = this.filterParams(params);
    return this.handlePaginate(
      filtered,
      this.stripe.paymentIntents.list(filtered.query, filtered.stripe)
    );
  }

  _get (id: string, params: ParamsWithStripe) {
    const { stripe } = this.filterParams(params);
    return this.stripe.paymentIntents.retrieve(id, stripe);
  }

  _create (data: Stripe.PaymentIntentCreateParams, params: ParamsWithStripe) {
    const { stripe } = this.filterParams(params);
    return this.stripe.paymentIntents.create(data, stripe);
  }

  _patch (id: string, data: { capture: boolean }, params: ParamsWithStripe)
  _patch (id: string, data: Stripe.PaymentIntentUpdateParams, params: ParamsWithStripe)
  _patch (id: string, data: { capture: boolean } | Stripe.PaymentIntentUpdateParams, params: ParamsWithStripe) {
    const { stripe } = this.filterParams(params);
    if ("capture" in data) {
      return this.stripe.paymentIntents.capture(id, stripe);
    }

    return this._update(id, data, params);
  }

  _update (id: string, data: Stripe.PaymentIntentUpdateParams, params: ParamsWithStripe) {
    const { stripe } = this.filterParams(params);
    return this.stripe.paymentIntents.update(id, data, stripe);
  }

  _remove: never
};
