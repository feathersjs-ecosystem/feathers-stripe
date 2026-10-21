import type { Stripe } from 'stripe'
import type {
  FindMethod,
  ParamsWithStripe,
  ParamsWithStripeQuery,
} from '../types.js'
import { BaseService } from './base.js'

export interface IBalanceTransactionService {
  _find: FindMethod<
    ParamsWithStripeQuery<Stripe.BalanceTransactionListParams>,
    Stripe.BalanceTransaction
  >
  _get: (
    id: string,
    params: ParamsWithStripe,
  ) => Promise<Stripe.BalanceTransaction>
  _create: never
  _update: never
  _patch: never
  _remove: never
}

export class BalanceTransactionService
  extends BaseService<IBalanceTransactionService>
  implements IBalanceTransactionService
{
  _get(id: string, params: ParamsWithStripe) {
    const { stripe } = this.filterParams(params)
    return this.stripe.balanceTransactions.retrieve(
      id,
      this.retrieveParams(params),
      stripe,
    )
  }

  _find(params: ParamsWithStripeQuery<Stripe.BalanceTransactionListParams>) {
    const filtered = this.filterParams(params)
    return this.handlePaginate(
      filtered,
      this.stripe.balanceTransactions.list(filtered.query, filtered.stripe),
    )
  }

  declare _create: never
  declare _update: never
  declare _patch: never
  declare _remove: never
}
