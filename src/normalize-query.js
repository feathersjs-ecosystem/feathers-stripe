export default function normalizeQuery(params) {
  let query = Object.assign({}, params.query);

  if (query.$limit) {
    query.limit = query.$limit;
    delete query.$limit;
  }

  return query;
}
