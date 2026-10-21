import type { Stripe } from 'stripe'
import type {
  FindMethod,
  ParamsWithStripe,
  ParamsWithStripeQuery,
} from '../types.js'
import { BaseService } from './base.js'

export interface ICreditNoteService {
  _find: FindMethod<
    ParamsWithStripeQuery<Stripe.CreditNoteListParams>,
    Stripe.CreditNote
  >
  _get: (id: string, params: ParamsWithStripe) => Promise<Stripe.CreditNote>
  _create: (
    data: Stripe.CreditNoteCreateParams,
    params: ParamsWithStripe,
  ) => Promise<Stripe.CreditNote>
  _update: (
    id: string,
    data: Stripe.CreditNoteUpdateParams,
    params: ParamsWithStripe,
  ) => Promise<Stripe.CreditNote>
  _patch: (
    id: string,
    data: Stripe.CreditNoteUpdateParams,
    params: ParamsWithStripe,
  ) => Promise<Stripe.CreditNote>
  _remove: (id: string, params: ParamsWithStripe) => Promise<Stripe.CreditNote>
}

/**
 * `remove` voids the credit note.
 */
export class CreditNoteService
  extends BaseService<ICreditNoteService>
  implements ICreditNoteService
{
  _find(params: ParamsWithStripeQuery<Stripe.CreditNoteListParams>) {
    const filtered = this.filterParams(params)
    return this.handlePaginate(
      filtered,
      this.stripe.creditNotes.list(filtered.query, filtered.stripe),
    )
  }

  _get(id: string, params: ParamsWithStripe) {
    const { stripe } = this.filterParams(params)
    return this.stripe.creditNotes.retrieve(
      id,
      this.retrieveParams(params),
      stripe,
    )
  }

  _create(data: Stripe.CreditNoteCreateParams, params: ParamsWithStripe) {
    const { stripe } = this.filterParams(params)
    return this.stripe.creditNotes.create(data, stripe)
  }

  _update(
    id: string,
    data: Stripe.CreditNoteUpdateParams,
    params: ParamsWithStripe,
  ) {
    const { stripe } = this.filterParams(params)
    return this.stripe.creditNotes.update(id, data, stripe)
  }

  _patch(
    id: string,
    data: Stripe.CreditNoteUpdateParams,
    params: ParamsWithStripe,
  ) {
    return this._update(id, data, params)
  }

  _remove(id: string, params: ParamsWithStripe) {
    const { stripe } = this.filterParams(params)
    return this.stripe.creditNotes.voidCreditNote(id, undefined, stripe)
  }
}
