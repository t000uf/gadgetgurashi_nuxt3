export default defineEventHandler((event) => {
  const id = getRouterParam(event, 'id');
  // 形式の合わないIDはmicroCMSに渡さない（パスに埋めると別のAPIを引ける）。存在しない記事と同じ404にする
  if (!isContentId(id)) {
    throw createError({ statusCode: 404 });
  }
  return fetchMicroCMS(`article/${id}`, pickQuery(event, ['depth']));
});
