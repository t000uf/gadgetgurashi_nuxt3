export default defineSitemapEventHandler(async () => {
  const fetchAll = async (endpoint: string) => {
    const limit = 100;
    let offset = 0;
    let allContents: any[] = [];

    while (true) {
      const data = await $fetch<any>(
        `https://${process.env.MICROCMS_SERVICE_DOMAIN}.microcms.io/api/v1/${endpoint}?limit=${limit}&offset=${offset}&fields=id`,
        {
          headers: { 'X-MICROCMS-API-KEY': process.env.MICROCMS_API_KEY ?? '' },
        },
      );
      allContents = [...allContents, ...data.contents];
      if (allContents.length >= data.totalCount) break;
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
