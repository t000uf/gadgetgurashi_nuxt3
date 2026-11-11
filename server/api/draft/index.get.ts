export default defineEventHandler(async (event) => {
  const { id, draftKey } = getQuery(event);

  // id はパスに埋めるので形式を確かめる（`../` などで別のAPIを引けないように）。
  // draftKey がないと公開中の内容がキャッシュなしで返ってしまうので、これも必須にする
  if (!isContentId(id) || typeof draftKey !== 'string' || !draftKey) {
    throw createError({
      statusCode: 400,
      message: 'Invalid "id" or "draftKey" query parameter',
    });
  }

  return fetchMicroCMS(`article/${id}`, { depth: 2, draftKey });
});
