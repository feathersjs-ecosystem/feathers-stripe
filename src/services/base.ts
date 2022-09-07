import type Stripe from 'stripe';
import { BadRequest, NotImplemented, Unavailable, NotAuthenticated, TooManyRequests, GeneralError, PaymentError, MethodNotAllowed } from '@feathersjs/errors';
import type { FeathersError } from '@feathersjs/errors';
import { _ } from '@feathersjs/commons';
import type { IUnderScoreFunctions, ParamsWithStripe, StripeServiceOptions } from '../types';
import type { Params, Query } from '@feathersjs/feathers';

type FilteredParams<T extends ParamsWithStripe = ParamsWithStripe> = {
  query: T['query'];
  stripe: T['stripe'];
  paginate: boolean
}

export abstract class BaseService<I extends IUnderScoreFunctions> {
  stripe: Stripe;
  options: StripeServiceOptions;

  abstract _find (params: Parameters<I['_find']>[0]): ReturnType<I['_find']>;
  abstract _get (id: string, params: Parameters<I['_get']>[1]): ReturnType<I['_get']>;
  abstract _create (data: Parameters<I['_create']>[0], params: Parameters<I['_create']>[1]): ReturnType<I['_create']>;
  abstract _update (id: string, data: Parameters<I['_update']>[1], params: Parameters<I['_update']>[2]): ReturnType<I['_update']>;
  abstract _patch (id: string, data: Parameters<I['_patch']>[1], params: Parameters<I['_patch']>[2]): ReturnType<I['_patch']>;
  abstract _remove (id: string, params: Parameters<I['_remove']>[1]): ReturnType<I['_remove']>;

  constructor (options: StripeServiceOptions) {
    const opts = {
      // Stripe enforces 100 max and 10 default
      paginate: {
        default: 10,
        max: 100
      },
      ...options
    };
    if (!opts.stripe) {
      throw new Error('Stripe service option `stripe` needs to be provided');
    }

    this.stripe = opts.stripe;
  }

  find (params: Parameters<I['_find']>[0]): ReturnType<I['_find']> {
    if (!(this as any)._find) {
      throw new NotImplemented('Find method not implemented');
    }
    return (this as any)._find(params).catch(this.handleError);
  }

  get (id: string, params: Parameters<I['_get']>[1]): ReturnType<I['_get']> {
    if (!(this as any)._get) {
      throw new NotImplemented('Get method not implemented');
    }
    return (this as any)._get(id, params).catch(this.handleError);
  }

  create (data: Parameters<I['_create']>[0], params: Parameters<I['_create']>[1]): ReturnType<I['_create']> {
    if (!(this as any)._create) {
      throw new NotImplemented('Create method not implemented');
    }
    return (this as any)._create(data, params).catch(this.handleError);
  }

  update (id: string, data: Parameters<I['_update']>[1], params: Parameters<I['_update']>[2]): ReturnType<I['_update']> {
    if (!(this as any)._update) {
      throw new NotImplemented('Update method not implemented');
    }
    return (this as any)._update(id, data, params).catch(this.handleError);
  }

  patch (id: string, data: Parameters<I['_patch']>[1], params: Parameters<I['_patch']>[2]): ReturnType<I['_patch']> {
    if (!(this as any)._patch) {
      throw new NotImplemented('Patch method not implemented');
    }
    return (this as any)._patch(id, data, params).catch(this.handleError);
  }

  remove (id: string, params: Parameters<I['_remove']>[1]): ReturnType<I['_remove']> {
    if (!(this as any)._remove) {
      throw new NotImplemented('Remove method not implemented');
    }
    return (this as any)._remove(id, params).catch(this.handleError);
  }

  getLimit (limit: number | undefined, paramsPaginate: false | { max: number } | undefined): number {
    if (paramsPaginate === false) {
      return limit;
    }
    const { paginate } = this.options;
    if (paginate && (paginate.default || paginate.max)) {
      const base = paginate.default || 0;
      const lower = typeof limit === 'number' && !isNaN(limit) ? limit : base;
      const upper = typeof paginate.max === 'number' ? paginate.max : Number.MAX_VALUE;

      return Math.min(lower, upper);
    }
    return limit;
  }

  cleanQuery <Q extends Query> (query: Q): Q {
    if (Array.isArray(query)) {
      // @ts-ignore
      return query.map((item) => this.cleanQuery(item));
    }
    if (_.isObject(query)) {
      const result = Object.assign({}, query);
      Object.entries(result).forEach(([key, value]) => {
        let cleanKey = key;
        if (key.startsWith('$')) {
          delete result[key];
          cleanKey = key.replace('$', '');
        }
        // @ts-ignore
        result[cleanKey] = this.cleanQuery(value);
      });
      return result;
    }
    return query;
  }

  filterQuery <P extends Params, Q extends Query> (params: P): Q {
    const query = Object.assign({}, params.query) as Q;
    const limit = query.$limit || query.limit;
    if (limit) {
      // @ts-ignore
      query.limit = this.getLimit(limit, params.paginate);
      delete query.$limit;
    }
    return this.cleanQuery<Q>(query);
  }

  filterParams <
    T extends ParamsWithStripe = ParamsWithStripe
  > (params: T): FilteredParams<T> {
    return {
      query: this.filterQuery(params),
      stripe: params.stripe,
      paginate: params.paginate !== false
    };
  }

  async handlePaginate <R = any> ({ paginate }: FilteredParams, stripeMethod: Stripe.ApiListPromise<R>): Promise<R[] | Stripe.ApiList<R>> {
    if (paginate) {
      return await stripeMethod;
    }
    if (stripeMethod.autoPagingEach) {
      // NOTE: This is similar to stripe's autoPagingToArray
      // but bypasses the 10,000 limit to better follow
      // feathers pagination standards. You get better
      // performance when using $limit because stripe
      // will use Math.min($limit, 100) as the "chunk"
      // size for each page of autoPagingEach. When
      // no $limit is provided, it falls back to a
      // page size of 10.
      const results: R[] = [];
      // console.time('pagination');
      await stripeMethod.autoPagingEach((result) => {
        results.push(result);
      });
      // console.timeEnd('pagination');
      return results;
    }
    throw new MethodNotAllowed(
      'Cannot use paginate: false on this method'
    );
  }

  handleError (error: Stripe.errors.StripeError) {
    let feathersError: FeathersError;

    if (error.type) {
      switch (error.type) {
      case 'StripeCardError':
        // A declined card error
        feathersError = new PaymentError(error, error);
        break;
      case 'StripeInvalidRequestError':
      case 'StripeInvalidRequestError':
        // Invalid parameters were supplied to Stripe's API
        feathersError = new BadRequest(error, error);
        break;
      case 'StripeAPIError':
        // An error occurred internally with Stripe's API
        feathersError = new Unavailable(error, error);
        break;
      case 'StripeConnectionError':
        // Some kind of error occurred during the HTTPS communication
        feathersError = new Unavailable(error, error);
        break;
      case 'StripeAuthenticationError':
        // You probably used an incorrect API key
        feathersError = new NotAuthenticated(error, error);
        break;
      case 'StripeRateLimitError':
        // Too many requests
        feathersError = new TooManyRequests(error, error);
        break;
      default:
        feathersError = new GeneralError(
          'Unknown Payment Gateway Error',
          error
        );
      }
    } else {
      feathersError = new GeneralError('Unknown Payment Gateway Error', error);
    }

    throw feathersError;
  }
}
