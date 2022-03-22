function filterQuery (params) {
  const query = Object.assign({}, params.query);

  if (query.$limit) {
    query.limit = query.$limit;
    delete query.$limit;
  }

  return query;
}

function filterParams (params) {
  if (!params) {
    return {
      query: {},
      stripe: {}
    };
  }
  const query = filterQuery(params);
  const stripe = params.stripe || {};
  return { query, stripe };
}

module.exports = {
  filterQuery,
  filterParams
};
