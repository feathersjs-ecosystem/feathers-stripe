import Stripe from 'stripe';
import { ParamsWithStripe } from '../types';
import { BaseService } from './base';

export interface ITransferService {
  _find: (params: ParamsWithStripe) => Promise<Stripe.ApiList<Stripe.Transfer>>;
  _get: (id: string, params: ParamsWithStripe) => Promise<Stripe.Transfer>;
  _create: (data: Stripe.TransferCreateParams, params: ParamsWithStripe) => Promise<Stripe.Transfer>;
  _update: (id: string, data: Stripe.TransferUpdateParams, params: ParamsWithStripe) => Promise<Stripe.Transfer>;
  _patch: (id: string, data: Stripe.TransferUpdateParams, params: ParamsWithStripe) => Promise<Stripe.Transfer>;
  _remove: (id: string, params: ParamsWithStripe) => Promise<Stripe.TransferReversal>;
}

export class TransferService extends BaseService<ITransferService> implements ITransferService {
  _find (params) {
    const filtered = this.filterParams(params);
    return this.handlePaginate(
      filtered,
      this.stripe.transfers.list(filtered.query, filtered.stripe)
    );
  }

  _get (id: string, params: ParamsWithStripe) {
    const { stripe } = this.filterParams(params);
    return this.stripe.transfers.retrieve(id, stripe);
  }

  _create (data: Stripe.TransferCreateParams, params: ParamsWithStripe) {
    const { stripe } = this.filterParams(params);
    return this.stripe.transfers.create(data, stripe);
  }

  _update (id: string, data: Stripe.TransferUpdateParams, params: ParamsWithStripe) {
    const { stripe } = this.filterParams(params);
    return this.stripe.transfers.update(id, data, stripe);
  }

  _patch (id: string, data: Stripe.TransferUpdateParams, params: ParamsWithStripe) {
    return this._update(id, data, params);
  }

  _remove (id: string, params: ParamsWithStripe) {
    const { stripe } = this.filterParams(params);
    return this.stripe.transfers.createReversal(id, stripe);
  }
};
