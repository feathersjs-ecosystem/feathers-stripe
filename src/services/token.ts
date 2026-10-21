import type { Stripe } from 'stripe'
import type { ParamsWithStripe } from '../types.js'
import { BaseService } from './base.js'

export interface ITokenService {
  _find: never
  _get: (id: string, params: ParamsWithStripe) => Promise<Stripe.Token>
  _create: (
    data: Stripe.TokenCreateParams,
    params: ParamsWithStripe,
  ) => Promise<Stripe.Token>
  _update: never
  _patch: never
  _remove: never
}

export class TokenService
  extends BaseService<ITokenService>
  implements ITokenService
{
  _get(id: string, params: ParamsWithStripe) {
    const { stripe } = this.filterParams(params)
    return this.stripe.tokens.retrieve(id, this.retrieveParams(params), stripe)
  }

  _create(data: Stripe.TokenCreateParams, params: ParamsWithStripe) {
    const { stripe } = this.filterParams(params)
    return this.stripe.tokens.create(data, stripe)
  }

  declare _find: never
  declare _update: never
  declare _patch: never
  declare _remove: never
}
