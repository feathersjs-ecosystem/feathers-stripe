import type { Stripe } from 'stripe'
import type {
  FindMethod,
  ParamsWithStripe,
  ParamsWithStripeQuery,
} from '../types.js'
import { BaseService } from './base.js'

export interface ISubscriptionScheduleService {
  _find: FindMethod<
    ParamsWithStripeQuery<Stripe.SubscriptionScheduleListParams>,
    Stripe.SubscriptionSchedule
  >
  _get: (
    id: string,
    params: ParamsWithStripe,
  ) => Promise<Stripe.SubscriptionSchedule>
  _create: (
    data: Stripe.SubscriptionScheduleCreateParams,
    params: ParamsWithStripe,
  ) => Promise<Stripe.SubscriptionSchedule>
  _update: (
    id: string,
    data: Stripe.SubscriptionScheduleUpdateParams,
    params: ParamsWithStripe,
  ) => Promise<Stripe.SubscriptionSchedule>
  _patch: (
    id: string,
    data: Stripe.SubscriptionScheduleUpdateParams,
    params: ParamsWithStripe,
  ) => Promise<Stripe.SubscriptionSchedule>
  _remove: (
    id: string,
    params: ParamsWithStripe,
  ) => Promise<Stripe.SubscriptionSchedule>
}

/**
 * `remove` cancels the subscription schedule.
 */
export class SubscriptionScheduleService
  extends BaseService<ISubscriptionScheduleService>
  implements ISubscriptionScheduleService
{
  _find(params: ParamsWithStripeQuery<Stripe.SubscriptionScheduleListParams>) {
    const filtered = this.filterParams(params)
    return this.handlePaginate(
      filtered,
      this.stripe.subscriptionSchedules.list(filtered.query, filtered.stripe),
    )
  }

  _get(id: string, params: ParamsWithStripe) {
    const { stripe } = this.filterParams(params)
    return this.stripe.subscriptionSchedules.retrieve(
      id,
      this.retrieveParams(params),
      stripe,
    )
  }

  _create(
    data: Stripe.SubscriptionScheduleCreateParams,
    params: ParamsWithStripe,
  ) {
    const { stripe } = this.filterParams(params)
    return this.stripe.subscriptionSchedules.create(data, stripe)
  }

  _update(
    id: string,
    data: Stripe.SubscriptionScheduleUpdateParams,
    params: ParamsWithStripe,
  ) {
    const { stripe } = this.filterParams(params)
    return this.stripe.subscriptionSchedules.update(id, data, stripe)
  }

  _patch(
    id: string,
    data: Stripe.SubscriptionScheduleUpdateParams,
    params: ParamsWithStripe,
  ) {
    return this._update(id, data, params)
  }

  _remove(id: string, params: ParamsWithStripe) {
    const { stripe } = this.filterParams(params)
    return this.stripe.subscriptionSchedules.cancel(id, undefined, stripe)
  }
}
