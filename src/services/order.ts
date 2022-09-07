import type Stripe from 'stripe';
import type { FindMethod, ParamsWithStripe, ParamsWithStripeQuery } from '../types';
import { BaseService } from './base';

export interface IOrderService {
  _find: FindMethod<ParamsWithStripeQuery<Stripe.OrderListParams>, Stripe.Order>;
  _get: (id: string, params: ParamsWithStripe) => Promise<Stripe.Order>;
  _create: (data: Stripe.OrderCreateParams, params: ParamsWithStripe) => Promise<Stripe.Order>;
  _update: (id: string, data: Stripe.OrderUpdateParams, params: ParamsWithStripe) => Promise<Stripe.Order>;
  _patch: (id: string, data: ({ submit: boolean } & Stripe.OrderSubmitParams) | Stripe.OrderUpdateParams, params: ParamsWithStripe) => Promise<Stripe.Order>;

  _remove: never
}

export class OrderService extends BaseService<IOrderService> implements IOrderService {
  _find (params: ParamsWithStripeQuery<Stripe.OrderListParams>) {
    const filtered = this.filterParams(params);
    return this.handlePaginate(
      filtered,
      this.stripe.orders.list(filtered.query, filtered.stripe)
    );
  }

  _get (id: string, params: ParamsWithStripe) {
    const { stripe } = this.filterParams(params);
    return this.stripe.orders.retrieve(id, stripe);
  }

  _create (data: Stripe.OrderCreateParams, params: ParamsWithStripe) {
    const { stripe } = this.filterParams(params);
    return this.stripe.orders.create(data, stripe);
  }

  _patch (id: string, data: ({ submit: boolean } & Stripe.OrderSubmitParams) | Stripe.OrderUpdateParams, params: ParamsWithStripe): Promise<Stripe.Order> {
    const { stripe } = this.filterParams(params);

    if ('submit' in data) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { submit, ...rest } = data;
      return this.stripe.orders.submit(id, rest, stripe);
    }

    return this._update(id, data, params);
  }

  _update (id: string, data: Stripe.OrderUpdateParams, params: ParamsWithStripe) {
    const { stripe } = this.filterParams(params);
    return this.stripe.orders.update(id, data, stripe);
  }

  _remove: never
}
