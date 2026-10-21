import type Stripe from "stripe";
import type {
  FindMethod,
  ParamsWithStripe,
  ParamsWithStripeQuery
} from "../types";
import { BaseService } from "./base";

export interface ICheckoutSessionService {
  _find: FindMethod<
    ParamsWithStripeQuery<Stripe.Checkout.SessionListParams>,
    Stripe.Checkout.Session
  >;
  _get: (id: string, params: ParamsWithStripe) => Promise<Stripe.Checkout.Session>;
  _create: (
    data: Stripe.Checkout.SessionCreateParams,
    params: ParamsWithStripe
  ) => Promise<Stripe.Checkout.Session>;
  _update: (
    id: string,
    data: Stripe.Checkout.SessionUpdateParams,
    params: ParamsWithStripe
  ) => Promise<Stripe.Checkout.Session>;
  _patch: never;
  _remove: (id: string, params: ParamsWithStripe) => Promise<Stripe.Checkout.Session>;
}

export class CheckoutSessionService
  extends BaseService<ICheckoutSessionService>
  implements ICheckoutSessionService
{
  _find(params: ParamsWithStripeQuery<Stripe.Checkout.SessionListParams>) {
    const filtered = this.filterParams(params);
    return this.handlePaginate(
      filtered,
      this.stripe.checkout.sessions.list(filtered.query, filtered.stripe)
    );
  }

  _get(id: string, params: ParamsWithStripe) {
    const { stripe } = this.filterParams(params);
    return this.stripe.checkout.sessions.retrieve(id, stripe);
  }

  _create(data: Stripe.Checkout.SessionCreateParams, params: ParamsWithStripe) {
    const { stripe } = this.filterParams(params);
    return this.stripe.checkout.sessions.create(data, stripe);
  }

  _update(
    id: string,
    data: Stripe.Checkout.SessionUpdateParams,
    params: ParamsWithStripe
  ) {
    const { stripe } = this.filterParams(params);
    return this.stripe.checkout.sessions.update(id, data, stripe);
  }

  _patch: never;

  _remove(id: string, params: ParamsWithStripe) {
    const { stripe } = this.filterParams(params);
    return this.stripe.checkout.sessions.expire(id, stripe);
  }
}
