import errors from 'feathers-errors';

export default function errorHandler(error) {
  let feathersError = error;

  if (error.type) {
    switch(error.type) {
      case 'StripeCardError':
        // A declined card error
        feathersError = new errors.PaymentError(error);
        break;
      case 'StripeInvalidRequestError':
      case 'StripeInvalidRequest':
        // Invalid parameters were supplied to Stripe's API
        feathersError = new errors.BadRequest(error);
        break;
      case 'StripeAPIError':
        // An error occurred internally with Stripe's API
        feathersError = new errors.Unavailable(error);
        break;
      case 'StripeConnectionError':
        // Some kind of error occurred during the HTTPS communication
        feathersError = new errors.Unavailable(error);
        break;
      case 'StripeAuthenticationError':
        // You probably used an incorrect API key
        feathersError = new errors.NotAuthenticated(error);
        break;
      default:
        feathersError = new errors.GeneralError('Unknown Payment Gateway Error', error);
    }
  }

  return Promise.reject(feathersError);
}
