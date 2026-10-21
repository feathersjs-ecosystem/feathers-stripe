import type { Stripe } from 'stripe'
import type { PaginationOptions, Params } from '@feathersjs/feathers'

export type StripeServiceOptions = {
  paginate?: PaginationOptions
  stripe: Stripe
}

export type StripeRequestOptions = Stripe.RequestOptions & {
  /**
   * @deprecated stripe no longer accepts `expand` as a request option.
   * Use `params.query.expand` instead.
   */
  expand?: string[]
}

export type ParamsWithStripe = {
  stripe?: StripeRequestOptions
  [key: string]: any
}

export type ParamsWithStripeQuery<Q = any> = Params<Q> & {
  stripe?: StripeRequestOptions
  [key: string]: any
}

export interface IUnderScoreFunctions {
  _find: never | ((...args: any) => any)
  _get: never | ((...args: any) => any)
  _create: never | ((data: any, params: any) => any)
  _update: never | ((id: string, data: any, params: any) => any)
  _patch: never | ((id: string, data: any, params: any) => any)
  _remove: never | ((id: string, params: any) => any)
  _search?: never | ((...args: any) => any)
}

export type FindMethod<P, R> = (params: P) => Promise<R[] | Stripe.ApiList<R>>
