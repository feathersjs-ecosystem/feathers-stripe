function normalizeQuery (params) {
  const query = Object.assign({}, params.query);

  if (query.$limit) {
    query.limit = query.$limit;
    delete query.$limit;
  }

  return query;
}

function normalizeParams (params) {
  if (!params) {
    return params;
  }
  const query = normalizeQuery(params);
  const stripe = params.stripe;
  return { query, stripe };
}

module.exports = {
  normalizeQuery,
  normalizeParams
};
