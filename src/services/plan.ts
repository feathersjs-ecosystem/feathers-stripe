import type Stripe from 'stripe';
import type { FindMethod, ParamsWithStripe, ParamsWithStripeQuery } from '../types';
import { BaseService } from './base';

export interface IPlanService {
  _find: FindMethod<ParamsWithStripeQuery<Stripe.PlanListParams>, Stripe.Plan>;
  _get: (id: string, params: ParamsWithStripe) => Promise<Stripe.Plan>;
  _create: (data: Stripe.PlanCreateParams, params: ParamsWithStripe) => Promise<Stripe.Plan>;
  _update: (id: string, data: Stripe.PlanUpdateParams, params: ParamsWithStripe) => Promise<Stripe.Plan>;
  _patch: (id: string, data: Stripe.PlanUpdateParams, params: ParamsWithStripe) => Promise<Stripe.Plan>;
  _remove: (id: string, params: ParamsWithStripe) => Promise<Stripe.DeletedPlan>;
}

export class PlanService extends BaseService<IPlanService> implements IPlanService {
  _find (params: ParamsWithStripeQuery<Stripe.PlanListParams>) {
    const filtered = this.filterParams(params);
    return this.handlePaginate(
      filtered,
      this.stripe.plans.list(filtered.query, filtered.stripe)
    );
  }

  _get (id: string, params: ParamsWithStripe) {
    const { stripe } = this.filterParams(params);
    return this.stripe.plans.retrieve(id, stripe);
  }

  _create (data: Stripe.PlanCreateParams, params: ParamsWithStripe) {
    const { stripe } = this.filterParams(params);
    return this.stripe.plans.create(data, stripe);
  }

  _update (id: string, data: Stripe.PlanUpdateParams, params: ParamsWithStripe) {
    const { stripe } = this.filterParams(params);
    return this.stripe.plans.update(id, data, stripe);
  }

  _patch (id: string, data: Stripe.PlanUpdateParams, params: ParamsWithStripe) {
    return this._update(id, data, params);
  }

  _remove (id: string, params: ParamsWithStripe) {
    const { stripe } = this.filterParams(params);
    return this.stripe.plans.del(id, stripe);
  }
}
