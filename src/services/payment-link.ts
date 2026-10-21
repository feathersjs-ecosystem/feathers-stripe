import type { Stripe } from 'stripe'
import type {
  FindMethod,
  ParamsWithStripe,
  ParamsWithStripeQuery,
} from '../types.js'
import { BaseService } from './base.js'

export interface IPaymentLinkService {
  _find: FindMethod<
    ParamsWithStripeQuery<Stripe.PaymentLinkListParams>,
    Stripe.PaymentLink
  >
  _get: (id: string, params: ParamsWithStripe) => Promise<Stripe.PaymentLink>
  _create: (
    data: Stripe.PaymentLinkCreateParams,
    params: ParamsWithStripe,
  ) => Promise<Stripe.PaymentLink>
  _update: (
    id: string,
    data: Stripe.PaymentLinkUpdateParams,
    params: ParamsWithStripe,
  ) => Promise<Stripe.PaymentLink>
  _patch: (
    id: string,
    data: Stripe.PaymentLinkUpdateParams,
    params: ParamsWithStripe,
  ) => Promise<Stripe.PaymentLink>
  _remove: never
}

export class PaymentLinkService
  extends BaseService<IPaymentLinkService>
  implements IPaymentLinkService
{
  _find(params: ParamsWithStripeQuery<Stripe.PaymentLinkListParams>) {
    const filtered = this.filterParams(params)
    return this.handlePaginate(
      filtered,
      this.stripe.paymentLinks.list(filtered.query, filtered.stripe),
    )
  }

  _get(id: string, params: ParamsWithStripe) {
    const { stripe } = this.filterParams(params)
    return this.stripe.paymentLinks.retrieve(
      id,
      this.retrieveParams(params),
      stripe,
    )
  }

  _create(data: Stripe.PaymentLinkCreateParams, params: ParamsWithStripe) {
    const { stripe } = this.filterParams(params)
    return this.stripe.paymentLinks.create(data, stripe)
  }

  _update(
    id: string,
    data: Stripe.PaymentLinkUpdateParams,
    params: ParamsWithStripe,
  ) {
    const { stripe } = this.filterParams(params)
    return this.stripe.paymentLinks.update(id, data, stripe)
  }

  _patch(
    id: string,
    data: Stripe.PaymentLinkUpdateParams,
    params: ParamsWithStripe,
  ) {
    return this._update(id, data, params)
  }

  declare _remove: never
}
