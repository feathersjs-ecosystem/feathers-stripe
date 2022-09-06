import Stripe from "stripe";

export type StripeServiceOptions = {
  secretKey: string;
  paginate?: {
    /** default: `10` */
    default: number;
    /** default: `100` */
    max: number;
  }
  stripe?: Stripe;
}

export type ParamsWithQ<T = Record<string, any>> = { query: T };

export type ParamsWithStripe = {
  stripe?: Stripe.RequestOptions;
  [key: string]: any;
}

export type ParamsWithStripeFee = {
  stripe: Partial<Stripe.RequestOptions> & { fee: string };
  [key: string]: any;
}

export type ParamsWithStripeQuery<Q = any> = {
  stripe?: Stripe.RequestOptions;
  [key: string]: any;
  query: Q
}

export interface IUnderScoreFunctions {
  _find: never | ((...args: any) => any);
  _get: never | ((...args: any) => any);
  _create: never | ((data: any, params: any) => any);
  _update: never | ((id: string, data: any, params: any) => any);
  _patch: never | ((id: string, data: any, params: any) => any);
  _remove: never | ((id: string, params: any) => any);
}
