import Stripe from 'stripe';
import { ParamsWithStripe } from '../types';
import { BaseService } from './base';

export interface IEventService {
  _find: (params: ParamsWithStripe) => Promise<Stripe.Event[]>;
  _get: (id: string, params: ParamsWithStripe) => Promise<Stripe.Event>;
  _create: never;
  _update: never;
  _patch: never;
  _remove: never;
}

export class EventService extends BaseService<IEventService> implements IEventService {
  _find (params) {
    const filtered = this.filterParams(params);
    return this.handlePaginate(
      filtered,
      this.stripe.events.list(filtered.query, filtered.stripe)
    );
  }

  _get (id: string, params: ParamsWithStripe) {
    const { stripe } = this.filterParams(params);
    return this.stripe.events.retrieve(id, stripe);
  }

  _create: never;
  _update: never;
  _patch: never;
  _remove: never;
};
