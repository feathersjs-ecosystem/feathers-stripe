import type Stripe from "stripe";
import type { FindMethod, ParamsWithStripe, ParamsWithStripeQuery } from "../types";
import { BaseService } from "./base";

export interface IBalanceTransactionService {
  _find: FindMethod<ParamsWithStripeQuery<Stripe.BalanceTransactionListParams>, Stripe.BalanceTransaction>;
  _get: (id: string, params: ParamsWithStripe) => Promise<Stripe.BalanceTransaction>;
  _create: never;
  _update: never;
  _patch: never;
  _remove: never;
}

export class BalanceTransactionService
  extends BaseService<IBalanceTransactionService>
  implements IBalanceTransactionService
{
  _get(id: string, params: ParamsWithStripe) {
    let { stripe } = this.filterParams(params);
    stripe = Object.assign({}, stripe);
    if (id) {
      stripe.stripeAccount = id;
    }
    return this.stripe.balanceTransactions.retrieve(undefined, stripe);
  }

  _find (params: ParamsWithStripeQuery<Stripe.BalanceTransactionListParams>) {
    const filtered = this.filterParams(params);
    return this.handlePaginate(
      filtered,
      this.stripe.balanceTransactions.list(filtered.query, filtered.stripe)
    );
  }
  
  _create: never;
  _update: never;
  _patch: never;
  _remove: never;
}
