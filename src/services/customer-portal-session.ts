import type Stripe from "stripe";
import type { ParamsWithStripe } from "../types";
import { BaseService } from "./base";

export interface ICustomerPortalSessionService {
  _find: never;
  _get: never;
  _create: (
    data: Stripe.BillingPortal.SessionCreateParams,
    params: ParamsWithStripe,
  ) => Promise<Stripe.BillingPortal.Session>;
  _update: never;
  _patch: never;
  _remove: never;
}

export class CustomerPortalSessionService
  extends BaseService<ICustomerPortalSessionService>
  implements ICustomerPortalSessionService
{
  _find: never;

  _get: never;

  _create(
    data: Stripe.BillingPortal.SessionCreateParams,
    params: ParamsWithStripe,
  ): Promise<Stripe.BillingPortal.Session> {
    const filtered = this.filterParams(params);
    return this.stripe.billingPortal.sessions.create(data, filtered.stripe);
  }

  _update: never;

  _patch: never;

  _remove: never;
}
