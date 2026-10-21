import type { Stripe } from 'stripe'
import type { ParamsWithStripe } from '../types.js'
import { BaseService } from './base.js'

export interface ICustomerSessionService {
  _find: never
  _get: never
  _create: (
    data: Stripe.CustomerSessionCreateParams,
    params: ParamsWithStripe,
  ) => Promise<Stripe.CustomerSession>
  _update: never
  _patch: never
  _remove: never
}

/**
 * Creates customer sessions for the pricing table, payment element, etc. Only `create` is supported.
 */
export class CustomerSessionService
  extends BaseService<ICustomerSessionService>
  implements ICustomerSessionService
{
  _create(data: Stripe.CustomerSessionCreateParams, params: ParamsWithStripe) {
    const { stripe } = this.filterParams(params)
    return this.stripe.customerSessions.create(data, stripe)
  }

  declare _find: never
  declare _get: never
  declare _update: never
  declare _patch: never
  declare _remove: never
}
