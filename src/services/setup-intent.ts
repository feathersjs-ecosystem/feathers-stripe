import Stripe from 'stripe';
import { ParamsWithStripe } from '../types';
import { BaseService } from './base';

export interface ISetupIntentService {
  _find: (params: ParamsWithStripe) => Promise<Stripe.ApiList<Stripe.SetupIntent>>;
  _get: (id: string, params: ParamsWithStripe) => Promise<Stripe.SetupIntent>;
  _create: (data: Stripe.SetupIntentCreateParams, params: ParamsWithStripe) => Promise<Stripe.SetupIntent>;
  _update: (id: string, data: Stripe.SetupIntentUpdateParams, params: ParamsWithStripe) => Promise<Stripe.SetupIntent>;
  _patch: (id: string, data: Stripe.SetupIntentUpdateParams, params: ParamsWithStripe) => Promise<Stripe.SetupIntent>;
  _remove: never;
}

export class SetupIntentService extends BaseService<ISetupIntentService> implements ISetupIntentService {
  _find (params) {
    const filtered = this.filterParams(params);
    return this.handlePaginate(
      filtered,
      this.stripe.setupIntents.list(filtered.query, filtered.stripe)
    );
  }

  _get (id: string, params: ParamsWithStripe) {
    const { stripe } = this.filterParams(params);
    return this.stripe.setupIntents.retrieve(id, stripe);
  }

  _create (data: Stripe.SetupIntentCreateParams, params: ParamsWithStripe) {
    const { stripe } = this.filterParams(params);
    return this.stripe.setupIntents.create(data, stripe);
  }

  _update (id: string, data: Stripe.SetupIntentUpdateParams, params: ParamsWithStripe) {
    const { stripe } = this.filterParams(params);
    return this.stripe.setupIntents.update(id, data, stripe);
  }

  _patch (id: string, data: Stripe.SetupIntentUpdateParams, params: ParamsWithStripe) {
    return this._update(id, data, params);
  }

  _remove: never;
};
