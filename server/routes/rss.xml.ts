type FeedArticle = {
  id: string;
  title?: string;
  preview?: string;
  createdAt: string;
};

const escapeXml = (value: string) =>
  value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

export default defineEventHandler(async (event) => {
  const data = await $fetch<{ contents: FeedArticle[] }>(
    `https://${process.env.MICROCMS_SERVICE_DOMAIN}.microcms.io/api/v1/article`,
    {
      headers: { 'X-MICROCMS-API-KEY': process.env.MICROCMS_API_KEY ?? '' },
      query: { limit: 20, fields: 'id,title,preview,createdAt' },
    },
  );

  const items = data.contents
    .map((article) => {
      const url = `https://gadgetgurashi.com/article/${article.id}`;
      return `
    <item>
      <title>${escapeXml(article.title ?? '')}</title>
      <link>${url}</link>
      <guid>${url}</guid>
      <pubDate>${new Date(article.createdAt).toUTCString()}</pubDate>
      <description>${escapeXml(article.preview ?? '')}</description>
    </item>`;
    })
    .join('');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>がじぇっとぐらし！</title>
    <link>https://gadgetgurashi.com</link>
    <description>オタクがガジェットやその他話題について書き散らします</description>
    <language>ja</language>${items}
  </channel>
</rss>
`;

  setHeader(event, 'Content-Type', 'application/rss+xml; charset=utf-8');
  return xml;
});
