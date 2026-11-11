export default defineEventHandler((event) =>
  fetchMicroCMS('tag', pickQuery(event, ['ids', 'fields'])),
);
