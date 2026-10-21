import type { Stripe } from 'stripe'
import type { ParamsWithStripe } from '../types.js'
import { BaseService } from './base.js'

export interface IBalanceService {
  _find: never
  _get: (id: string, params: ParamsWithStripe) => Promise<Stripe.Balance>
  _create: never
  _update: never
  _patch: never
  _remove: never
}

export class BalanceService
  extends BaseService<IBalanceService>
  implements IBalanceService
{
  _get(id: string, params: ParamsWithStripe) {
    let { stripe } = this.filterParams(params)
    stripe = { ...stripe }
    if (id) {
      stripe.stripeAccount = id
    }
    return this.stripe.balance.retrieve(this.retrieveParams(params), stripe)
  }

  declare _find: never
  declare _create: never
  declare _update: never
  declare _patch: never
  declare _remove: never
}
