import type Stripe from "stripe";
import {
  BadRequest,
  NotImplemented,
  Unavailable,
  NotAuthenticated,
  TooManyRequests,
  GeneralError,
  PaymentError,
  MethodNotAllowed
} from "@feathersjs/errors";
import { _ } from "@feathersjs/commons";
import type {
  IUnderScoreFunctions,
  ParamsWithStripe,
  StripeServiceOptions
} from "../types";
import type { Params, Query } from "@feathersjs/feathers";

type FilteredParams<T extends ParamsWithStripe = ParamsWithStripe> = {
  query: T["query"];
  stripe: T["stripe"];
  paginate: boolean;
};

export abstract class BaseService<
  I extends IUnderScoreFunctions,
  Find extends I["_find"] = I["_find"],
  Get extends I["_get"] = I["_get"],
  Create extends I["_create"] = I["_create"],
  Update extends I["_update"] = I["_update"],
  Patch extends I["_patch"] = I["_patch"],
  Remove extends I["_remove"] = I["_remove"]
> {
  stripe: Stripe;
  options: StripeServiceOptions;

  abstract _find(params: Parameters<Find>[0]): ReturnType<Find>;
  abstract _get(id: string, params: Parameters<Get>[1]): ReturnType<Get>;
  abstract _create(
    data: Parameters<Create>[0],
    params: Parameters<Create>[1]
  ): ReturnType<Create>;
  abstract _update(
    id: string,
    data: Parameters<Update>[1],
    params: Parameters<Update>[2]
  ): ReturnType<Update>;
  abstract _patch(
    id: string,
    data: Parameters<Patch>[1],
    params: Parameters<Patch>[2]
  ): ReturnType<Patch>;
  abstract _remove(
    id: string,
    params: Parameters<Remove>[1]
  ): ReturnType<Remove>;

  constructor(options: StripeServiceOptions) {
    const opts = {
      // Stripe enforces 100 max and 10 default
      paginate: {
        default: 10,
        max: 100
      },
      ...options
    };
    if (!opts.stripe) {
      throw new Error("Stripe service option `stripe` needs to be provided");
    }

    this.stripe = opts.stripe;
  }

  find(params: Parameters<Find>[0]): ReturnType<Find> {
    if (!(this as any)._find) {
      throw new NotImplemented("Find method not implemented");
    }
    return (this as any)._find(params).catch(this.handleError);
  }

  get(id: Parameters<Get>[0], params: Parameters<Get>[1]): ReturnType<Get> {
    if (!(this as any)._get) {
      throw new NotImplemented("Get method not implemented");
    }
    return (this as any)._get(id, params).catch(this.handleError);
  }

  create(
    data: Parameters<Create>[0],
    params: Parameters<Create>[1]
  ): ReturnType<Create> {
    if (!(this as any)._create) {
      throw new NotImplemented("Create method not implemented");
    }
    return (this as any)._create(data, params).catch(this.handleError);
  }

  update(
    id: Parameters<Update>[0],
    data: Parameters<Update>[1],
    params: Parameters<Update>[2]
  ): ReturnType<Update> {
    if (!(this as any)._update) {
      throw new NotImplemented("Update method not implemented");
    }
    return (this as any)._update(id, data, params).catch(this.handleError);
  }

  patch(
    id: Parameters<Patch>[0],
    data: Parameters<Patch>[1],
    params: Parameters<Patch>[2]
  ): ReturnType<Patch> {
    if (!(this as any)._patch) {
      throw new NotImplemented("Patch method not implemented");
    }
    return (this as any)._patch(id, data, params).catch(this.handleError);
  }

  remove(
    id: Parameters<Remove>[0],
    params: Parameters<Remove>[1]
  ): ReturnType<Remove> {
    if (!(this as any)._remove) {
      throw new NotImplemented("Remove method not implemented");
    }
    return (this as any)._remove(id, params).catch(this.handleError);
  }

  getLimit(
    limit: number | undefined,
    paramsPaginate: false | { max: number } | undefined
  ): number {
    if (paramsPaginate === false) {
      return limit;
    }
    const paginate = this.options?.paginate;
    if (paginate && (paginate.default || paginate.max)) {
      const base = paginate.default || 0;
      const lower = typeof limit === "number" && !isNaN(limit) ? limit : base;
      const upper =
        typeof paginate.max === "number" ? paginate.max : Number.MAX_VALUE;

      return Math.min(lower, upper);
    }
    return limit;
  }

  cleanQuery<Q extends Query | Query[]>(query: Q): Q {
    if (Array.isArray(query)) {
      // @ts-expect-error TODO: fix this
      return query.map((item) => this.cleanQuery(item));
    }
    if (_.isObject(query)) {
      const result = Object.assign({}, query);
      Object.entries(result).forEach(([key, value]) => {
        let cleanKey = key;
        if (key.startsWith("$")) {
          // @ts-expect-error TODO: fix this
          delete result[key];
          cleanKey = key.replace("$", "");
        }
        // @ts-expect-error TODO: fix this
        result[cleanKey] = this.cleanQuery(value);
      });
      return result;
    }
    return query;
  }

  filterQuery<
    P extends ParamsWithStripe,
    Q = P extends Params<infer T> ? T : Query
  >(params: P): Q {
    const query = Object.assign({}, params.query);
    const limit = query.$limit ?? query.limit;
    if (limit) {
      query.limit = this.getLimit(limit, params.paginate);
      delete query.$limit;
    }
    return this.cleanQuery<Q>(query);
  }

  filterParams<T extends ParamsWithStripe = ParamsWithStripe>(
    params: T
  ): FilteredParams<T> {
    return {
      query: this.filterQuery(params),
      stripe: params.stripe,
      paginate: params.paginate !== false
    };
  }

  async handlePaginate<R = any>(
    { paginate }: FilteredParams,
    stripeMethod: Stripe.ApiListPromise<R>
  ): Promise<R[] | Stripe.ApiList<R>> {
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
      await stripeMethod.autoPagingEach((result) => {
        results.push(result);
      });
      return results;
    }
    throw new MethodNotAllowed("Cannot use paginate: false on this method");
  }

  handleError(error: Stripe.errors.StripeError) {
    if (!error.type) {
      throw new GeneralError("Unknown Payment Gateway Error", error);
    }

    switch (error.type) {
      case "StripeCardError":
        // A declined card error
        throw new PaymentError(error, error);
      case "StripeInvalidRequestError":
        // Invalid parameters were supplied to Stripe's API
        throw new BadRequest(error, error);
      case "StripeAPIError":
        // An error occurred internally with Stripe's API
        throw new Unavailable(error, error);
      case "StripeConnectionError":
        // Some kind of error occurred during the HTTPS communication
        throw new Unavailable(error, error);
      case "StripeAuthenticationError":
        // You probably used an incorrect API key
        throw new NotAuthenticated(error, error);
      case "StripeRateLimitError":
        // Too many requests
        throw new TooManyRequests(error, error);
      default:
        throw new GeneralError("Unknown Payment Gateway Error", error);
    }
  }
}
