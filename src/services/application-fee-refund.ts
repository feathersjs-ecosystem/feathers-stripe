import { BadRequest } from '@feathersjs/errors'
import type { Stripe } from 'stripe'
import type { FindMethod, ParamsWithStripeQuery } from '../types.js'
import { BaseService } from './base.js'

type ParamsWithFee = ParamsWithStripeQuery<{ fee: string }>

export interface IApplicationFeeRefundService {
  _find: FindMethod<
    ParamsWithStripeQuery<
      Stripe.ApplicationFeeListRefundsParams & { fee: string }
    >,
    Stripe.FeeRefund
  >
  _get: (id: string, params: ParamsWithFee) => Promise<Stripe.FeeRefund>
  _create: (
    data: Stripe.ApplicationFeeCreateRefundParams,
    params: ParamsWithFee,
  ) => Promise<Stripe.FeeRefund>
  _update: (
    id: string,
    data: Stripe.ApplicationFeeUpdateRefundParams,
    params: ParamsWithFee,
  ) => Promise<Stripe.FeeRefund>
  _patch: (
    id: string,
    data: Stripe.ApplicationFeeUpdateRefundParams,
    params: ParamsWithFee,
  ) => Promise<Stripe.FeeRefund>
  _remove: never
}

/**
 * Refunds of an application fee. The fee id is passed as `params.query.fee`.
 */
export class ApplicationFeeRefundService
  extends BaseService<IApplicationFeeRefundService>
  implements IApplicationFeeRefundService
{
  _find(
    params: ParamsWithStripeQuery<
      Stripe.ApplicationFeeListRefundsParams & { fee: string }
    >,
  ) {
    const filtered = this.filterParams(params)
    const { fee, ...query } = filtered.query
    if (!fee) {
      throw new BadRequest('Missing Stripe fee id')
    }
    return this.handlePaginate(
      filtered,
      this.stripe.applicationFees.listRefunds(fee, query, filtered.stripe),
    )
  }

  _get(id: string, params: ParamsWithFee) {
    const { query, stripe } = this.filterParams(params)
    if (!query.fee) {
      throw new BadRequest('Missing Stripe fee id')
    }
    return this.stripe.applicationFees.retrieveRefund(
      query.fee,
      id,
      this.retrieveParams(params),
      stripe,
    )
  }

  _create(
    data: Stripe.ApplicationFeeCreateRefundParams,
    params: ParamsWithFee,
  ) {
    const { query, stripe } = this.filterParams(params)
    if (!query.fee) {
      throw new BadRequest('Missing Stripe fee id')
    }
    return this.stripe.applicationFees.createRefund(query.fee, data, stripe)
  }

  _update(
    id: string,
    data: Stripe.ApplicationFeeUpdateRefundParams,
    params: ParamsWithFee,
  ) {
    const { query, stripe } = this.filterParams(params)
    if (!query.fee) {
      throw new BadRequest('Missing Stripe fee id')
    }
    return this.stripe.applicationFees.updateRefund(query.fee, id, data, stripe)
  }

  _patch(
    id: string,
    data: Stripe.ApplicationFeeUpdateRefundParams,
    params: ParamsWithFee,
  ) {
    return this._update(id, data, params)
  }

  declare _remove: never
}
