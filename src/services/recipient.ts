import Stripe from 'stripe';
import { ParamsWithStripe } from '../types';
import { BaseService } from './base';

export interface IRecipientService {
  _find: (params: ParamsWithStripe) => Promise<Stripe.ApiList<Stripe.Recipient>>;
  _get: (id: string, params: ParamsWithStripe) => Promise<Stripe.Recipient>;
  _create: (data: Stripe.RecipientCreateParams, params: ParamsWithStripe) => Promise<Stripe.Recipient>;
  _update: (id: string, data: Stripe.RecipientUpdateParams, params: ParamsWithStripe) => Promise<Stripe.Recipient>;
  _patch: (id: string, data: Stripe.RecipientUpdateParams, params: ParamsWithStripe) => Promise<Stripe.Recipient>;
  _remove: never
}

export class RecipientService extends BaseService<IRecipientService> implements IRecipientService {
  _find (params) {
    const filtered = this.filterParams(params);
    return this.handlePaginate(
      filtered,
      this.stripe.recipients.list(filtered.query, filtered.stripe)
    );
  }

  _get (id: string, params: ParamsWithStripe) {
    const { stripe } = this.filterParams(params);
    return this.stripe.recipients.retrieve(id, stripe);
  }

  _create (data, params: ParamsWithStripe) {
    const { stripe } = this.filterParams(params);
    return this.stripe.recipients.create(data, stripe);
  }

  _update (id, data, params: ParamsWithStripe) {
    const { stripe } = this.filterParams(params);
    return this.stripe.recipients.update(id, data, stripe);
  }

  _remove: never
};
