import type Stripe from "stripe";
import type { FindMethod, ParamsWithStripe, ParamsWithStripeQuery } from "../types";
import { BaseService } from "./base";

export interface IProductService {
  _find: FindMethod<ParamsWithStripeQuery<Stripe.ProductListParams>, Stripe.Product>;
  _get: (id: string, params: ParamsWithStripe) => Promise<Stripe.Product>;
  _create: (data: Stripe.ProductCreateParams, params: ParamsWithStripe) => Promise<Stripe.Product>;
  _update: (id: string, data: Stripe.ProductUpdateParams, params: ParamsWithStripe) => Promise<Stripe.Product>;
  _patch: (id: string, data: Stripe.ProductUpdateParams, params: ParamsWithStripe) => Promise<Stripe.Product>;
  _remove: (id: string, params: ParamsWithStripe) => Promise<Stripe.DeletedProduct>;
}

export class ProductService extends BaseService<IProductService> implements IProductService {
  _find (params: ParamsWithStripeQuery<Stripe.ProductListParams>) {
    const filtered = this.filterParams(params);
    return this.handlePaginate(
      filtered,
      this.stripe.products.list(filtered.query, filtered.stripe)
    );
  }

  _get (id: string, params: ParamsWithStripe) {
    const { stripe } = this.filterParams(params);
    return this.stripe.products.retrieve(id, stripe);
  }

  _create (data: Stripe.ProductCreateParams, params: ParamsWithStripe) {
    const { stripe } = this.filterParams(params);
    return this.stripe.products.create(data, stripe);
  }

  _update (id: string, data: Stripe.ProductUpdateParams, params: ParamsWithStripe) {
    const { stripe } = this.filterParams(params);
    return this.stripe.products.update(id, data, stripe);
  }

  _patch (id: string, data: Stripe.ProductUpdateParams, params: ParamsWithStripe) {
    return this._update(id, data, params);
  }

  _remove (id: string, params: ParamsWithStripe) {
    const { stripe } = this.filterParams(params);
    return this.stripe.products.del(id, stripe);
  }
}
