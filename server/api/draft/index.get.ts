export default defineEventHandler(async (event) => {
  const { id, draftKey } = getQuery(event);

  if (!id) {
    throw createError({
      statusCode: 400,
      message: 'Missing "id" query parameter',
    });
  }

  const data = await $fetch(
    `https://${process.env.MICROCMS_SERVICE_DOMAIN}.microcms.io/api/v1/article/${id}?depth=2&draftKey=${draftKey}`,
    {
      headers: { 'X-MICROCMS-API-KEY': process.env.MICROCMS_API_KEY ?? '' },
    },
  );

  return data;
});
