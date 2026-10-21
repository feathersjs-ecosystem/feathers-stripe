import type { Stripe } from 'stripe'
import type {
  FindMethod,
  ParamsWithStripe,
  ParamsWithStripeQuery,
} from '../types.js'
import { BaseService } from './base.js'

export interface IPromotionCodeService {
  _find: FindMethod<
    ParamsWithStripeQuery<Stripe.PromotionCodeListParams>,
    Stripe.PromotionCode
  >
  _get: (id: string, params: ParamsWithStripe) => Promise<Stripe.PromotionCode>
  _create: (
    data: Stripe.PromotionCodeCreateParams,
    params: ParamsWithStripe,
  ) => Promise<Stripe.PromotionCode>
  _update: (
    id: string,
    data: Stripe.PromotionCodeUpdateParams,
    params: ParamsWithStripe,
  ) => Promise<Stripe.PromotionCode>
  _patch: (
    id: string,
    data: Stripe.PromotionCodeUpdateParams,
    params: ParamsWithStripe,
  ) => Promise<Stripe.PromotionCode>
  _remove: never
}

export class PromotionCodeService
  extends BaseService<IPromotionCodeService>
  implements IPromotionCodeService
{
  _find(params: ParamsWithStripeQuery<Stripe.PromotionCodeListParams>) {
    const filtered = this.filterParams(params)
    return this.handlePaginate(
      filtered,
      this.stripe.promotionCodes.list(filtered.query, filtered.stripe),
    )
  }

  _get(id: string, params: ParamsWithStripe) {
    const { stripe } = this.filterParams(params)
    return this.stripe.promotionCodes.retrieve(
      id,
      this.retrieveParams(params),
      stripe,
    )
  }

  _create(data: Stripe.PromotionCodeCreateParams, params: ParamsWithStripe) {
    const { stripe } = this.filterParams(params)
    return this.stripe.promotionCodes.create(data, stripe)
  }

  _update(
    id: string,
    data: Stripe.PromotionCodeUpdateParams,
    params: ParamsWithStripe,
  ) {
    const { stripe } = this.filterParams(params)
    return this.stripe.promotionCodes.update(id, data, stripe)
  }

  _patch(
    id: string,
    data: Stripe.PromotionCodeUpdateParams,
    params: ParamsWithStripe,
  ) {
    return this._update(id, data, params)
  }

  declare _remove: never
}
