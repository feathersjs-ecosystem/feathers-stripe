import type { Stripe } from 'stripe'
import type { ParamsWithStripe } from '../types.js'
import { BaseService } from './base.js'

export interface IAccountLinksService {
  _find: never
  _get: never
  _create(
    data: Stripe.AccountLinkCreateParams,
    params: ParamsWithStripe,
  ): Promise<Stripe.AccountLink>
  _update: never
  _patch: never
  _remove: never
}

export class AccountLinkService
  extends BaseService<IAccountLinksService>
  implements IAccountLinksService
{
  _create(data: Stripe.AccountLinkCreateParams, params: ParamsWithStripe) {
    const { stripe } = this.filterParams(params)

    return this.stripe.accountLinks.create(data, stripe)
  }

  declare _find: never
  declare _get: never
  declare _update: never
  declare _patch: never
  declare _remove: never
}
