import type Stripe from 'stripe';
import { BaseService } from './base';
import makeDebug from 'debug';
import type { FindMethod, ParamsWithStripe, ParamsWithStripeQuery } from '../types';

const debug = makeDebug('feathers-stripe:external-account');

export interface IExternalAccountService {
  _find: FindMethod<ParamsWithStripeQuery<Stripe.ExternalAccountListParams & { account: string }>, Stripe.BankAccount | Stripe.Card>;
  _get: (id: string, params: ParamsWithStripeQuery<{ account: string }>) => Promise<Stripe.BankAccount | Stripe.Card>;
  _create: (data: Stripe.ExternalAccountCreateParams & { account: string }, params: ParamsWithStripe) => Promise<Stripe.BankAccount | Stripe.Card>;
  _update: (id: string, data: Stripe.ExternalAccountUpdateParams, params: ParamsWithStripeQuery<{ account: string }>) => Promise<Stripe.BankAccount | Stripe.Card>;
  _patch: (id: string, data: Stripe.ExternalAccountUpdateParams, params: ParamsWithStripeQuery<{ account: string }>) => Promise<Stripe.BankAccount | Stripe.Card>;
  _remove: (id: string, params: ParamsWithStripeQuery<{ account: string }>) => Promise<Stripe.DeletedBankAccount | Stripe.DeletedCard>;
}

export class ExternalAccountService extends BaseService<IExternalAccountService> implements IExternalAccountService {
  _find (params: ParamsWithStripeQuery<Stripe.ExternalAccountListParams & { account: string }>) {
    const filtered = this.filterParams(params);
    const { account, ...query } = filtered.query;
    if (!account) {
      debug('Missing Stripe account id');
    }
    return this.handlePaginate(
      filtered,
      this.stripe.accounts.listExternalAccounts(account, query, filtered.stripe)
    );
  }

  _get (id: string, params: ParamsWithStripeQuery<{ account: string }>) {
    const { query, stripe } = this.filterParams(params);
    if (!query.account) {
      debug('Missing Stripe account id');
    }
    return this.stripe.accounts.retrieveExternalAccount(
      query.account,
      id,
      stripe
    );
  }

  // TODO: move 'account' to 'query'?
  _create (data: Stripe.ExternalAccountCreateParams & { account: string }, params: ParamsWithStripe) {
    const { stripe } = this.filterParams(params);
    const { account, ...rest } = data;
    if (!account) {
      debug('Missing Stripe account id');
    }
    return this.stripe.accounts.createExternalAccount(account, rest, stripe);
  }

  _update (id: string, data: Stripe.ExternalAccountUpdateParams, params: ParamsWithStripeQuery<{ account: string }>) {
    const { query, stripe } = this.filterParams(params);
    if (!query.account) {
      debug('Missing Stripe account id');
    }
    return this.stripe.accounts.updateExternalAccount(
      query.account,
      id,
      data,
      stripe
    );
  }

  _patch (id: string, data: Stripe.ExternalAccountUpdateParams, params: ParamsWithStripeQuery<{ account: string }>) {
    return this._update(id, data, params);
  }

  _remove (id: string, params: ParamsWithStripeQuery<{ account: string }>) {
    const { query, stripe } = this.filterParams(params);
    if (!query.account) {
      debug('Missing Stripe account id');
    }
    return this.stripe.accounts.deleteExternalAccount(
      query.account,
      id,
      stripe
    );
  }
}
