import type Stripe from "stripe";
import type { FindMethod, ParamsWithStripe, ParamsWithStripeQuery } from "../types";
import { BaseService } from "./base";
import makeDebug from "debug";

const debug = makeDebug("feathers-stripe:transferReversal");

export interface ITransferReversalService {
  _find: FindMethod<ParamsWithStripeQuery<Stripe.TransferReversalListParams & { transfer: string }>, Stripe.TransferReversal>;
  _get: (id: string, params: ParamsWithStripe & { query: { transfer: string } }) => Promise<Stripe.TransferReversal>;
  _create: (data: Stripe.TransferReversalCreateParams & { transfer: string }, params: ParamsWithStripe) => Promise<Stripe.TransferReversal>;
  _update: (id: string, data: Stripe.TransferReversalUpdateParams, params: ParamsWithStripeQuery<{ transfer: string }>) => Promise<Stripe.TransferReversal>;
  _patch: (id: string, data: Stripe.TransferReversalUpdateParams, params: ParamsWithStripeQuery<{ transfer: string }>) => Promise<Stripe.TransferReversal>;
  _remove: never;
}

export class TransferReversalService extends BaseService<ITransferReversalService> implements ITransferReversalService {
  _find (params: ParamsWithStripeQuery<Stripe.TransferReversalListParams & { transfer: string }>) {
    const filtered = this.filterParams(params);
    const { transfer, ...query } = filtered.query;
    if (!transfer) {
      debug("Missing Stripe transfer id");
    }
    return this.handlePaginate(
      filtered,
      this.stripe.transfers.listReversals(transfer, query, filtered.stripe)
    );
  }

  _get (id: string, params: ParamsWithStripe & { query: { transfer: string } }) {
    const { query, stripe } = this.filterParams(params);
    if (!query.transfer) {
      debug("Missing Stripe transfer id");
    }
    return this.stripe.transfers.retrieveReversal(query.transfer, id, stripe);
  }

  _create (data: Stripe.TransferReversalCreateParams & { transfer: string }, params: ParamsWithStripe) {
    const { stripe } = this.filterParams(params);
    const { transfer, ...rest } = data;
    if (!transfer) {
      debug("Missing Stripe transfer id");
    }
    return this.stripe.transfers.createReversal(transfer, rest, stripe);
  }

  _update (id: string, data: Stripe.TransferReversalUpdateParams, params: ParamsWithStripeQuery<{ transfer: string }>) {
    const { query, stripe } = this.filterParams(params);
    if (!query.transfer) {
      debug("Missing Stripe transfer id");
    }
    return this.stripe.transfers.updateReversal(
      query.transfer,
      id,
      data,
      stripe
    );
  }

  _patch (id: string, data: Stripe.TransferReversalUpdateParams, params: ParamsWithStripeQuery<{ transfer: string }>) {
    return this._update(id, data, params);
  }

  _remove: never;
}
