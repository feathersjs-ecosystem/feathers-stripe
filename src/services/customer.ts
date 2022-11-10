import type Stripe from "stripe";
import type {
  FindMethod,
  ParamsWithStripe,
  ParamsWithStripeQuery
} from "../types";
import { BaseService } from "./base";

export interface ICustomerService {
  _find: FindMethod<
    ParamsWithStripeQuery<Stripe.CustomerListParams>,
    Stripe.Customer
  >;
  _get: (
    id: string,
    params: ParamsWithStripe
  ) => Promise<Stripe.Customer | Stripe.DeletedCustomer>;
  _create: (
    data: Stripe.CustomerCreateParams,
    params: ParamsWithStripe
  ) => Promise<Stripe.Customer>;
  _update: (
    id: string,
    data: Stripe.CustomerUpdateParams,
    params: ParamsWithStripe
  ) => Promise<Stripe.Customer>;
  _patch: (
    id: string,
    data: Stripe.CustomerUpdateParams,
    params: ParamsWithStripe
  ) => Promise<Stripe.Customer>;
  _remove: (
    id: string,
    params: ParamsWithStripe
  ) => Promise<Stripe.DeletedCustomer>;
}

export class CustomerService
  extends BaseService<ICustomerService>
  implements ICustomerService
{
  _find(params: ParamsWithStripeQuery<Stripe.CustomerListParams>) {
    const filtered = this.filterParams(params);
    return this.handlePaginate(
      filtered,
      this.stripe.customers.list(filtered.query, filtered.stripe)
    );
  }

  _get(id: string, params: ParamsWithStripe) {
    const { stripe } = this.filterParams(params);
    return this.stripe.customers.retrieve(id, stripe);
  }

  _create(data: Stripe.CustomerCreateParams, params: ParamsWithStripe) {
    const { stripe } = this.filterParams(params);
    return this.stripe.customers.create(data, stripe);
  }

  _update(
    id: string,
    data: Stripe.CustomerUpdateParams,
    params: ParamsWithStripe
  ) {
    const { stripe } = this.filterParams(params);
    return this.stripe.customers.update(id, data, stripe);
  }

  _patch(
    id: string,
    data: Stripe.CustomerUpdateParams,
    params: ParamsWithStripe
  ) {
    return this._update(id, data, params);
  }

  _remove(id: string, params: ParamsWithStripe) {
    const { stripe } = this.filterParams(params);
    return this.stripe.customers.del(id, stripe);
  }
}
