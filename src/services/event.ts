import type { Stripe } from 'stripe'
import type {
  FindMethod,
  ParamsWithStripe,
  ParamsWithStripeQuery,
} from '../types.js'
import { BaseService } from './base.js'

export interface IEventService {
  _find: FindMethod<ParamsWithStripeQuery<Stripe.EventListParams>, Stripe.Event>
  _get: (id: string, params: ParamsWithStripe) => Promise<Stripe.Event>
  _create: never
  _update: never
  _patch: never
  _remove: never
}

export class EventService
  extends BaseService<IEventService>
  implements IEventService
{
  _find(params: ParamsWithStripeQuery<Stripe.EventListParams>) {
    const filtered = this.filterParams(params)
    return this.handlePaginate(
      filtered,
      this.stripe.events.list(filtered.query, filtered.stripe),
    )
  }

  _get(id: string, params: ParamsWithStripe) {
    const { stripe } = this.filterParams(params)
    return this.stripe.events.retrieve(id, this.retrieveParams(params), stripe)
  }

  declare _create: never
  declare _update: never
  declare _patch: never
  declare _remove: never
}
