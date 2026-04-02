export default defineEventHandler(async (event) => {
  const query = getQuery(event);

  return await $fetch(`https://${process.env.MICROCMS_SERVICE_DOMAIN}.microcms.io/api/v1/article`, {
    headers: { 'X-MICROCMS-API-KEY': process.env.MICROCMS_API_KEY ?? '' },
    query,
  });
});
