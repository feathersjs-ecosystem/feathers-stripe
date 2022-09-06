import Stripe from 'stripe';
import { ParamsWithStripe } from '../types';
import { BaseService } from './base';

export interface IAccountService {
  _find: (params: ParamsWithStripe) => Promise<Stripe.Account>;
  _get: (id: string, params: ParamsWithStripe) => Promise<Stripe.Account>;
  _create: (data: Stripe.AccountCreateParams, params: ParamsWithStripe) => Promise<Stripe.Account>;
  _update: (id: string, data: Stripe.AccountUpdateParams, params: ParamsWithStripe) => Promise<Stripe.Account>;
  _patch: (id: string, data: Stripe.AccountUpdateParams, params: ParamsWithStripe) => Promise<Stripe.Account>;
  _remove: never
}

export class AccountService extends BaseService<IAccountService> implements IAccountService {
  _find (params) {
    const filtered = this.filterParams(params);
    return this.handlePaginate(
      filtered,
      this.stripe.accounts.list(filtered.query, filtered.stripe)
    );
  }

  _get (id: string, params: ParamsWithStripe) {
    const { stripe } = this.filterParams(params);
    return this.stripe.accounts.retrieve(id, stripe);
  }

  _create (data: Stripe.AccountCreateParams, params: ParamsWithStripe) {
    const { stripe } = this.filterParams(params);
    return this.stripe.accounts.create(data, stripe);
  }

  _update (id: string, data: Stripe.AccountUpdateParams, params: ParamsWithStripe) {
    const { stripe } = this.filterParams(params);
    return this.stripe.accounts.update(id, data, stripe);
  }

  _patch (id: string, data: Stripe.AccountUpdateParams, params: ParamsWithStripe) {
    return this._update(id, data, params);
  }

  _remove: never
};
