import type { Stripe } from 'stripe'
import type { ParamsWithStripe } from '../types.js'
import { BaseService } from './base.js'

export interface IBillingMeterEventService {
  _find: never
  _get: never
  _create: (
    data: Stripe.Billing.MeterEventCreateParams,
    params: ParamsWithStripe,
  ) => Promise<Stripe.Billing.MeterEvent>
  _update: never
  _patch: never
  _remove: never
}

/**
 * Reports usage for usage-based billing. Only `create` is supported.
 */
export class BillingMeterEventService
  extends BaseService<IBillingMeterEventService>
  implements IBillingMeterEventService
{
  _create(
    data: Stripe.Billing.MeterEventCreateParams,
    params: ParamsWithStripe,
  ) {
    const { stripe } = this.filterParams(params)
    return this.stripe.billing.meterEvents.create(data, stripe)
  }

  declare _find: never
  declare _get: never
  declare _update: never
  declare _patch: never
  declare _remove: never
}
