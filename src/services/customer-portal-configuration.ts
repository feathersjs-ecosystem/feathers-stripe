import type Stripe from "stripe";
import type {
  FindMethod,
  ParamsWithStripe,
  ParamsWithStripeQuery,
} from "../types";
import { BaseService } from "./base";

export interface ICustomerPortalConfigurationService {
  _find: FindMethod<
    ParamsWithStripeQuery<Stripe.BillingPortal.ConfigurationListParams>,
    Stripe.BillingPortal.Configuration
  >;
  _get: (
    id: string,
    params: ParamsWithStripe,
  ) => Promise<Stripe.BillingPortal.Configuration>;
  _create: (
    data: Stripe.BillingPortal.ConfigurationCreateParams,
    params: ParamsWithStripe,
  ) => Promise<Stripe.BillingPortal.Configuration>;
  _update: (
    id: string,
    data: Stripe.BillingPortal.ConfigurationUpdateParams,
    params: ParamsWithStripe,
  ) => Promise<Stripe.BillingPortal.Configuration>;
  _patch: (
    id: string,
    data: Stripe.BillingPortal.ConfigurationUpdateParams,
    params: ParamsWithStripe,
  ) => Promise<Stripe.BillingPortal.Configuration>;
  _remove: never
}

export class CustomerPortalConfigurationService
  extends BaseService<ICustomerPortalConfigurationService>
  implements ICustomerPortalConfigurationService
{
  _find(
    params: ParamsWithStripeQuery<Stripe.BillingPortal.ConfigurationListParams>,
  ): Promise<
    | Stripe.BillingPortal.Configuration[]
    | Stripe.ApiList<Stripe.BillingPortal.Configuration>
  > {
    const filtered = this.filterParams(params);
    return this.handlePaginate(
      filtered,
      this.stripe.billingPortal.configurations.list(
        filtered.query,
        filtered.stripe,
      ),
    );
  }

  _get(
    id: string,
    params: ParamsWithStripe,
  ): Promise<Stripe.BillingPortal.Configuration> {
    const filtered = this.filterParams(params);
    return this.stripe.billingPortal.configurations.retrieve(
      id,
      filtered.stripe,
    );
  }

  _create(
    data: Stripe.BillingPortal.ConfigurationCreateParams,
    params: ParamsWithStripe,
  ): Promise<Stripe.BillingPortal.Configuration> {
    const filtered = this.filterParams(params);
    return this.stripe.billingPortal.configurations.create(
      data,
      filtered.stripe,
    );
  }

  _update(
    id: string,
    data: Stripe.BillingPortal.ConfigurationUpdateParams,
    params: ParamsWithStripe,
  ): Promise<Stripe.BillingPortal.Configuration> {
    const filtered = this.filterParams(params);
    return this.stripe.billingPortal.configurations.update(
      id,
      data,
      filtered.stripe,
    );
  }

  _patch(
    id: string,
    data: Stripe.BillingPortal.ConfigurationUpdateParams,
    params: ParamsWithStripe,
  ): Promise<Stripe.BillingPortal.Configuration> {
    const filtered = this.filterParams(params);
    return this.stripe.billingPortal.configurations.update(
      id,
      data,
      filtered.stripe,
    );
  }

  _remove: never;
}
