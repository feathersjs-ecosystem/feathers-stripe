import Stripe from 'stripe';
import { ParamsWithStripe, ParamsWithStripeQuery } from '../types';
import { BaseService } from './base';

export interface IBalanceService {
  _find: (params: ParamsWithStripeQuery<Stripe.BalanceRetrieveParams>) => Promise<Stripe.Balance>;
  _get: (id: string, params: ParamsWithStripe) => Promise<Stripe.Balance>;
  _create: never
  _update: never
  _patch: never
  _remove: never
}

export class BalanceService extends BaseService<IBalanceService> implements IBalanceService {
  _find (params: ParamsWithStripeQuery<Stripe.BalanceRetrieveParams>) {
    const { query, stripe } = this.filterParams(params);
    return this.stripe.balance.retrieve(query, stripe);
  }

  _get (id: string, params: ParamsWithStripe) {
    const { stripe } = this.filterParams(params);
    return this.stripe.balance.retrieve({ stripe_account: id }, stripe);
  }

  _create: never;
  _update: never;
  _patch: never;
  _remove: never;
};
