import type { Stripe } from 'stripe'
import type { ParamsWithStripe } from '../types.js'
import { BaseService } from './base.js'

export interface ICustomerPortalSessionService {
  _find: never
  _get: never
  _create: (
    data: Stripe.BillingPortal.SessionCreateParams,
    params: ParamsWithStripe,
  ) => Promise<Stripe.BillingPortal.Session>
  _update: never
  _patch: never
  _remove: never
}

export class CustomerPortalSessionService
  extends BaseService<ICustomerPortalSessionService>
  implements ICustomerPortalSessionService
{
  declare _find: never

  declare _get: never

  _create(
    data: Stripe.BillingPortal.SessionCreateParams,
    params: ParamsWithStripe,
  ): Promise<Stripe.BillingPortal.Session> {
    const filtered = this.filterParams(params)
    return this.stripe.billingPortal.sessions.create(data, filtered.stripe)
  }

  declare _update: never

  declare _patch: never

  declare _remove: never
}
