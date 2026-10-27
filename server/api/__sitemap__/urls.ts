export default defineSitemapEventHandler(async (event) => {
  const fetchAll = async (endpoint: string) => {
    const limit = 100;
    let offset = 0;
    let allContents: any[] = [];

    while (true) {
      const data = await fetchMicroCMS<any>(event, endpoint, { limit, offset, fields: 'id' });
      allContents = [...allContents, ...data.contents];
      // 取得の途中で記事が削除されると totalCount に届かないまま空のページが返るので、そこで止める
      if (data.contents.length === 0 || allContents.length >= data.totalCount) break;
      offset += limit;
    }

    return allContents;
  };

  const [articles, tags] = await Promise.all([fetchAll('article'), fetchAll('tag')]);

  const articleUrls = articles.map((a: any) => ({
    loc: `/article/${a.id}`,
  }));

  const tagUrls = tags.map((t: any) => ({
    loc: `/tag/${t.id}/page/1`,
  }));

  return [...articleUrls, ...tagUrls];
});
