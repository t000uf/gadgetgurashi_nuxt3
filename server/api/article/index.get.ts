export default defineEventHandler((event) =>
  fetchMicroCMS('article', pickQuery(event, ['limit', 'offset', 'fields', 'filters'])),
);
