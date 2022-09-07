import type Stripe from 'stripe';
import type { ParamsWithStripe } from '../types';
import { BaseService } from './base';

export interface IBalanceService {
  _find: never;
  _get: (id: string, params: ParamsWithStripe) => Promise<Stripe.Balance>;
  _create: never
  _update: never
  _patch: never
  _remove: never
}

export class BalanceService extends BaseService<IBalanceService> implements IBalanceService {
  _get (id: string, params: ParamsWithStripe) {
    let { stripe } = this.filterParams(params);
    stripe = Object.assign({}, stripe);
    if (id) {
      stripe.stripeAccount = id;
    }
    return this.stripe.balance.retrieve(undefined, stripe);
  }

  _find: never;
  _create: never;
  _update: never;
  _patch: never;
  _remove: never;
}
