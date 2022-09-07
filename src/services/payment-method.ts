import type Stripe from 'stripe';
import type { FindMethod, ParamsWithStripe, ParamsWithStripeQuery } from '../types';
import { BaseService } from './base';

export interface IPaymentMethodService {
  _find: FindMethod<ParamsWithStripeQuery<Stripe.PaymentMethodListParams>, Stripe.PaymentMethod>;
  _get: (id: string, params: ParamsWithStripe) => Promise<Stripe.PaymentMethod>;
  _create: (data: Stripe.PaymentMethodCreateParams, params: ParamsWithStripe) => Promise<Stripe.PaymentMethod>;
  _update: (id: string, data: Stripe.PaymentMethodUpdateParams, params: ParamsWithStripe) => Promise<Stripe.PaymentMethod>;

  _patch:
    ((id: string, data: { attach: boolean } & Stripe.PaymentMethodAttachParams, params: ParamsWithStripe) => Promise<Stripe.PaymentMethod>) |
    ((id: string, data: Stripe.PaymentMethodUpdateParams, params: ParamsWithStripe) => Promise<Stripe.PaymentMethod>);

  _remove: (id: string, params: ParamsWithStripe) => Promise<Stripe.PaymentMethod>;
}

export class PaymentMethodService extends BaseService<IPaymentMethodService> implements IPaymentMethodService {
  _find (params: ParamsWithStripeQuery<Stripe.PaymentMethodListParams>) {
    const filtered = this.filterParams(params);
    return this.handlePaginate(
      filtered,
      this.stripe.paymentMethods.list(filtered.query, filtered.stripe)
    );
  }

  _get (id: string, params: ParamsWithStripe) {
    const { stripe } = this.filterParams(params);
    return this.stripe.paymentMethods.retrieve(id, stripe);
  }

  _create (data: Stripe.PaymentMethodCreateParams, params: ParamsWithStripe) {
    const { stripe } = this.filterParams(params);
    return this.stripe.paymentMethods.create(data, stripe);
  }

  _update (id: string, data: Stripe.PaymentMethodUpdateParams, params: ParamsWithStripe) {
    const { stripe } = this.filterParams(params);
    return this.stripe.paymentMethods.update(id, data, stripe);
  }

  _patch (id: string, data: ({ attach: boolean } & Stripe.PaymentMethodAttachParams) | Stripe.PaymentMethodUpdateParams, params: ParamsWithStripe): Promise<Stripe.PaymentMethod> {
    const { stripe } = this.filterParams(params);

    if ('attach' in data) {
      const { attach, ...rest } = data;
      if (attach) {
        return this.stripe.paymentMethods.attach(id, rest, stripe);
      }
    }

    return this._update(id, data, params);
  }

  _remove (id: string, params: ParamsWithStripe) {
    const { stripe } = this.filterParams(params);
    return this.stripe.paymentMethods.detach(id, stripe);
  }
}
