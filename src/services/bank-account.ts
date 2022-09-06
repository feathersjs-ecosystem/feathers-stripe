const makeDebug = require('debug');
import Stripe from 'stripe';
import { ParamsWithStripeQuery } from '../types';
import { BaseService } from './base';

const debug = makeDebug('feathers-stripe:card');

export interface IBankAccountService {
  _find: (params: ParamsWithStripeQuery<{ customer: string }>) => Promise<Stripe.CustomerSource>;
  _get: (id: string, params: ParamsWithStripeQuery<{ customer: string }>) => Promise<Stripe.CustomerSource>;
  _create: (data: Stripe.CustomerSourceCreateParams & { customer: string }, params: ParamsWithStripeQuery<{ customer: string }>) => Promise<Stripe.CustomerSource>;
  _update: (id: string, data: Stripe.CustomerSourceUpdateParams, params: ParamsWithStripeQuery<{ customer: string }>) => Promise<Stripe.BankAccount | Stripe.Card | Stripe.Source>;
  _patch: (id: string, data: Stripe.CustomerSourceUpdateParams, params: ParamsWithStripeQuery<{ customer: string }>) => Promise<Stripe.BankAccount | Stripe.Card | Stripe.Source>;
  _remove: (id: string, params: ParamsWithStripeQuery<{ customer: string }>) => Promise<Stripe.CustomerSource | Stripe.DeletedBankAccount | Stripe.DeletedCard>;
}

export class BankAccountService extends BaseService<IBankAccountService> implements IBankAccountService {
  _find (params) {
    const filtered = this.filterParams(params);
    const { customer, ...query } = filtered.query;
    if (!customer) {
      debug('Missing Stripe customer id');
    }
    if (!query.type) {
      query.type = 'bank_account';
    }
    return this.handlePaginate(
      filtered,
      this.stripe.customers.listSources(customer, query, filtered.stripe)
    );
  }

  _get (id: string, params: ParamsWithStripeQuery<{ customer: string }>) {
    const { query, stripe } = this.filterParams(params);
    if (!query.customer) {
      debug('Missing Stripe customer id');
    }
    return this.stripe.customers.retrieveSource(query.customer, id, stripe);
  }

  _create (data: Stripe.CustomerSourceCreateParams, params: ParamsWithStripeQuery<{ customer: string }>) {
    const { query, stripe } = this.filterParams(params);
    if (!query.customer) {
      debug('Missing Stripe customer id');
    }
    return this.stripe.customers.createSource(query.customer, data, stripe);
  }

  _update (id: string, data: Stripe.CustomerSourceUpdateParams, params: ParamsWithStripeQuery<{ customer: string }>) {
    const { query, stripe } = this.filterParams(params);
    if (!query.customer) {
      debug('Missing Stripe customer id');
    }
    return this.stripe.customers.updateSource(query.customer, id, data, stripe);
  }

  _patch (id: string, data: Stripe.CustomerSourceUpdateParams, params: ParamsWithStripeQuery<{ customer: string }>) {
    return this._update(id, data, params);
  }

  _remove (id: string, params: ParamsWithStripeQuery<{ customer: string }>) {
    const { query, stripe } = this.filterParams(params);
    if (!query.customer) {
      debug('Missing Stripe customer id');
    }
    return this.stripe.customers.deleteSource(query.customer, id, stripe);
  }
};
