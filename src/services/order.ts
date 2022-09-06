import Stripe from 'stripe';
import { ParamsWithStripe } from '../types';
import { BaseService } from './base';

export interface IOrderService {
  _find: (params: ParamsWithStripe) => Promise<Stripe.Order[]>;
  _get: (id: string, params: ParamsWithStripe) => Promise<Stripe.Order>;
  _create: (data: Stripe.OrderCreateParams, params: ParamsWithStripe) => Promise<Stripe.Order>;
  _update: (id: string, data: Stripe.OrderUpdateParams, params: ParamsWithStripe) => Promise<Stripe.Order>;
  _patch:
    ((id: string, data: { pay: boolean } & Stripe.OrderPayParams, params: ParamsWithStripe) => Promise<Stripe.Order>) |
    ((id: string, data: Stripe.OrderUpdateParams, params: ParamsWithStripe) => Promise<Stripe.Order>);

  _remove: never
}

export class OrderService extends BaseService<IOrderService> implements IOrderService {
  _find (params) {
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

  _patch (id: string, data: { pay: boolean } & Stripe.OrderPayParams, params: ParamsWithStripe)
  _patch (id: string, data: Stripe.OrderUpdateParams, params: ParamsWithStripe)
  _patch (id: string, data: { pay: boolean } & Stripe.OrderPayParams | Stripe.OrderUpdateParams, params: ParamsWithStripe) {
    const { stripe } = this.filterParams(params);

    if ("pay" in data) {
      const { pay, ...rest } = data;
      return this.stripe.orders.pay(id, rest, stripe);
    }

    return this._update(id, data, params);
  }

  _update (id: string, data: Stripe.OrderUpdateParams, params: ParamsWithStripe) {
    const { stripe } = this.filterParams(params);
    return this.stripe.orders.update(id, data, stripe);
  }

  _remove: never
};
