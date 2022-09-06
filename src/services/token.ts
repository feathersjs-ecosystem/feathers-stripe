import Stripe from 'stripe';
import { ParamsWithStripe } from '../types';
import { BaseService } from './base';

export interface ITokenService {
  _find: never;
  _get: (id: string, params: ParamsWithStripe) => Promise<Stripe.Token>;
  _create: (data: Stripe.TokenCreateParams, params: ParamsWithStripe) => Promise<Stripe.Token>;
  _update: never;
  _patch: never;
  _remove: never;
}

export class TokenService extends BaseService<ITokenService> implements ITokenService {
  _get (id: string, params: ParamsWithStripe) {
    const { stripe } = this.filterParams(params);
    return this.stripe.tokens.retrieve(id, stripe);
  }

  _create (data: Stripe.TokenCreateParams, params: ParamsWithStripe) {
    const { stripe } = this.filterParams(params);
    return this.stripe.tokens.create(data, stripe);
  }

  _find: never;
  _update: never;
  _patch: never;
  _remove: never;
};
