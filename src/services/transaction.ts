import Stripe from 'stripe';
import { ParamsWithStripe } from '../types';
import { BaseService } from './base';

export interface ITransactionService {
  _find: (params: ParamsWithStripe) => Promise<Stripe.ApiList<Stripe.BalanceTransaction>>;
  _get: (id: string, params: ParamsWithStripe) => Promise<Stripe.BalanceTransaction>;
  _create: never;
  _update: never;
  _patch: never;
  _remove: never;
}

export class TransactionService extends BaseService<ITransactionService> implements ITransactionService {
  _find (params) {
    const filtered = this.filterParams(params);
    return this.handlePaginate(
      filtered,
      this.stripe.balanceTransactions.list(filtered.query, filtered.stripe)
    );
  }

  _get (id: string, params: ParamsWithStripe) {
    const { stripe } = this.filterParams(params);
    return this.stripe.balanceTransactions.retrieve(id, stripe);
  }

  _create: never;
  _update: never;
  _patch: never;
  _remove: never;
};
