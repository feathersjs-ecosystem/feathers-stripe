import type { Stripe } from 'stripe'
import type {
  FindMethod,
  ParamsWithStripe,
  ParamsWithStripeQuery,
} from '../types.js'
import { BaseService } from './base.js'

export interface IBillingMeterService {
  _find: FindMethod<
    ParamsWithStripeQuery<Stripe.Billing.MeterListParams>,
    Stripe.Billing.Meter
  >
  _get: (id: string, params: ParamsWithStripe) => Promise<Stripe.Billing.Meter>
  _create: (
    data: Stripe.Billing.MeterCreateParams,
    params: ParamsWithStripe,
  ) => Promise<Stripe.Billing.Meter>
  _update: (
    id: string,
    data: Stripe.Billing.MeterUpdateParams,
    params: ParamsWithStripe,
  ) => Promise<Stripe.Billing.Meter>
  _patch: (
    id: string,
    data: Stripe.Billing.MeterUpdateParams,
    params: ParamsWithStripe,
  ) => Promise<Stripe.Billing.Meter>
  _remove: (
    id: string,
    params: ParamsWithStripe,
  ) => Promise<Stripe.Billing.Meter>
}

/**
 * `remove` deactivates the meter.
 */
export class BillingMeterService
  extends BaseService<IBillingMeterService>
  implements IBillingMeterService
{
  _find(params: ParamsWithStripeQuery<Stripe.Billing.MeterListParams>) {
    const filtered = this.filterParams(params)
    return this.handlePaginate(
      filtered,
      this.stripe.billing.meters.list(filtered.query, filtered.stripe),
    )
  }

  _get(id: string, params: ParamsWithStripe) {
    const { stripe } = this.filterParams(params)
    return this.stripe.billing.meters.retrieve(
      id,
      this.retrieveParams(params),
      stripe,
    )
  }

  _create(data: Stripe.Billing.MeterCreateParams, params: ParamsWithStripe) {
    const { stripe } = this.filterParams(params)
    return this.stripe.billing.meters.create(data, stripe)
  }

  _update(
    id: string,
    data: Stripe.Billing.MeterUpdateParams,
    params: ParamsWithStripe,
  ) {
    const { stripe } = this.filterParams(params)
    return this.stripe.billing.meters.update(id, data, stripe)
  }

  _patch(
    id: string,
    data: Stripe.Billing.MeterUpdateParams,
    params: ParamsWithStripe,
  ) {
    return this._update(id, data, params)
  }

  _remove(id: string, params: ParamsWithStripe) {
    const { stripe } = this.filterParams(params)
    return this.stripe.billing.meters.deactivate(id, undefined, stripe)
  }
}
