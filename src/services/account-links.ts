import type Stripe from "stripe";
import type { ParamsWithStripe } from "../types";
import { BaseService } from "./base";

export interface IAccountLinksService {
  _find: never;
  _get: never;
  _create(
    data: Stripe.AccountLinkCreateParams,
    params: ParamsWithStripe
  ): Promise<Stripe.AccountLink>;
  _update: never;
  _patch: never;
  _remove: never;
}

export class AccountLinkService
  extends BaseService<IAccountLinksService>
  implements IAccountLinksService
{
  _create(data: Stripe.AccountLinkCreateParams, params: ParamsWithStripe) {
    const { stripe } = this.filterParams(params);

    return this.stripe.accountLinks.create(data, stripe);
  }

  _find: never;
  _get: never;
  _update: never;
  _patch: never;
  _remove: never;
}
