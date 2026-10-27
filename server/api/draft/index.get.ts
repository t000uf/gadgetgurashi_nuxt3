export default defineEventHandler(async (event) => {
  const { id, draftKey } = getQuery(event);

  if (!id) {
    throw createError({
      statusCode: 400,
      message: 'Missing "id" query parameter',
    });
  }

  return fetchMicroCMS(event, `article/${id}`, { depth: 2, draftKey });
});
