export default defineEventHandler((event) =>
  fetchMicroCMS(event, `article/${getRouterParam(event, 'id')}`),
);
