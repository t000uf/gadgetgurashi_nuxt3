export default defineEventHandler(async (event) => {
  setHeader(event, 'Cache-Control', 's-maxage=60, stale-while-revalidate');

  const query = getQuery(event);

  return await $fetch(`https://${process.env.MICROCMS_SERVICE_DOMAIN}.microcms.io/api/v1/tag`, {
    headers: { 'X-MICROCMS-API-KEY': process.env.MICROCMS_API_KEY ?? '' },
    query,
  });
});
