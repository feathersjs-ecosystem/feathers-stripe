// Heavily inspired from https://github.com/fixate/feathers-stripe-webhooks
const Base = require('./base');

module.exports = class Webhook extends Base {
  constructor (options = {}) {
    super(options);

    if (!options.app) {
      throw new Error('options.app is required');
    }

    this.app = options.app;
    this.handlers = options.handlers || {};

    this.app.post(options.route, (req, res, next) => {
      const signature = req.headers['stripe-signature'];
      if (!signature) {
        res.status(400).end('Bad signature');
        return;
      }

      try {
        this.stripe.webhooks.constructEvent(req.rawBody, signature, options.endpointSecret);
      } catch (err) {
        res.status(400).end(err);
        return;
      }

      next();
    });
  }

  getHandler (event) {
    const parts = event.type.split('.');
    let node = this.handlers;

    for (const p in parts) {
      node = node[parts[p]];

      if (!node) { return null; }
    }

    return node;
  }

  create (event, params) {
    const handler = this.getHandler(event);
    if (!handler) {
      // No handler, nothing to do
      return Promise.resolve({});
    }

    return handler({ object: event.data.object, event, params, app: this.app });
  }
};
