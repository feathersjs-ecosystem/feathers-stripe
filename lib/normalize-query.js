module.exports = function normalizeQuery (params) {
  const query = Object.assign({}, params.query);

  if (query.$limit) {
    query.limit = query.$limit;
    delete query.$limit;
  }

  return query;
};
