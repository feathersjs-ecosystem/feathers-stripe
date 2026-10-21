import type { Stripe } from 'stripe'
import type {
  FindMethod,
  ParamsWithStripe,
  ParamsWithStripeQuery,
} from '../types.js'
import { BaseService } from './base.js'

export interface ITaxRateService {
  _find: FindMethod<
    ParamsWithStripeQuery<Stripe.TaxRateListParams>,
    Stripe.TaxRate
  >
  _get: (id: string, params: ParamsWithStripe) => Promise<Stripe.TaxRate>
  _create: (
    data: Stripe.TaxRateCreateParams,
    params: ParamsWithStripe,
  ) => Promise<Stripe.TaxRate>
  _update: (
    id: string,
    data: Stripe.TaxRateUpdateParams,
    params: ParamsWithStripe,
  ) => Promise<Stripe.TaxRate>
  _patch: (
    id: string,
    data: Stripe.TaxRateUpdateParams,
    params: ParamsWithStripe,
  ) => Promise<Stripe.TaxRate>
  _remove: never
}

export class TaxRateService
  extends BaseService<ITaxRateService>
  implements ITaxRateService
{
  _find(params: ParamsWithStripeQuery<Stripe.TaxRateListParams>) {
    const filtered = this.filterParams(params)
    return this.handlePaginate(
      filtered,
      this.stripe.taxRates.list(filtered.query, filtered.stripe),
    )
  }

  _get(id: string, params: ParamsWithStripe) {
    const { stripe } = this.filterParams(params)
    return this.stripe.taxRates.retrieve(
      id,
      this.retrieveParams(params),
      stripe,
    )
  }

  _create(data: Stripe.TaxRateCreateParams, params: ParamsWithStripe) {
    const { stripe } = this.filterParams(params)
    return this.stripe.taxRates.create(data, stripe)
  }

  _update(
    id: string,
    data: Stripe.TaxRateUpdateParams,
    params: ParamsWithStripe,
  ) {
    const { stripe } = this.filterParams(params)
    return this.stripe.taxRates.update(id, data, stripe)
  }

  _patch(
    id: string,
    data: Stripe.TaxRateUpdateParams,
    params: ParamsWithStripe,
  ) {
    return this._update(id, data, params)
  }

  declare _remove: never
}
