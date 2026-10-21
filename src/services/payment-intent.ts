import { BadRequest } from '@feathersjs/errors'
import type { Stripe } from 'stripe'
import type {
  FindMethod,
  ParamsWithStripe,
  ParamsWithStripeQuery,
} from '../types.js'
import { BaseService } from './base.js'

export type PaymentIntentPatchData =
  | ({ capture: true } & Stripe.PaymentIntentCaptureParams)
  | ({ confirm: true } & Stripe.PaymentIntentConfirmParams)
  | ({ cancel: true } & Stripe.PaymentIntentCancelParams)
  | Stripe.PaymentIntentUpdateParams

export interface IPaymentIntentService {
  _find: FindMethod<
    ParamsWithStripeQuery<Stripe.PaymentIntentListParams>,
    Stripe.PaymentIntent
  >
  _get: (id: string, params: ParamsWithStripe) => Promise<Stripe.PaymentIntent>
  _create: (
    data: Stripe.PaymentIntentCreateParams,
    params: ParamsWithStripe,
  ) => Promise<Stripe.PaymentIntent>
  _update: (
    id: string,
    data: Stripe.PaymentIntentUpdateParams,
    params: ParamsWithStripe,
  ) => Promise<Stripe.PaymentIntent>
  _patch: (
    id: string,
    data: PaymentIntentPatchData,
    params: ParamsWithStripe,
  ) => Promise<Stripe.PaymentIntent>
  _remove: never
}

export class PaymentIntentService
  extends BaseService<IPaymentIntentService>
  implements IPaymentIntentService
{
  _find(params: ParamsWithStripeQuery<Stripe.PaymentIntentListParams>) {
    const filtered = this.filterParams(params)
    return this.handlePaginate(
      filtered,
      this.stripe.paymentIntents.list(filtered.query, filtered.stripe),
    )
  }

  _get(id: string, params: ParamsWithStripe) {
    const { stripe } = this.filterParams(params)
    return this.stripe.paymentIntents.retrieve(
      id,
      this.retrieveParams(params),
      stripe,
    )
  }

  _create(data: Stripe.PaymentIntentCreateParams, params: ParamsWithStripe) {
    const { stripe } = this.filterParams(params)
    return this.stripe.paymentIntents.create(data, stripe)
  }

  /**
   * `{ capture: true }`, `{ confirm: true }` and `{ cancel: true }` capture,
   * confirm or cancel the payment intent. The other fields are passed on as
   * params, e.g. `{ cancel: true, cancellation_reason: 'abandoned' }`.
   * Without one of these flags the payment intent is updated.
   */
  _patch(
    id: string,
    data: PaymentIntentPatchData,
    params: ParamsWithStripe,
  ): Promise<Stripe.PaymentIntent> {
    const { stripe } = this.filterParams(params)
    const { capture, confirm, cancel, ...rest } = data as Record<string, any>

    if ([capture, confirm, cancel].filter(Boolean).length > 1) {
      throw new BadRequest(
        'Only one of `capture`, `confirm` and `cancel` can be set',
      )
    }
    if (capture) {
      return this.stripe.paymentIntents.capture(id, rest, stripe)
    }
    if (confirm) {
      return this.stripe.paymentIntents.confirm(id, rest, stripe)
    }
    if (cancel) {
      return this.stripe.paymentIntents.cancel(id, rest, stripe)
    }

    return this._update(id, rest, params)
  }

  _update(
    id: string,
    data: Stripe.PaymentIntentUpdateParams,
    params: ParamsWithStripe,
  ) {
    const { stripe } = this.filterParams(params)
    return this.stripe.paymentIntents.update(id, data, stripe)
  }

  declare _remove: never
}
