import type { H3Event } from 'h3';

// microCMSへのプロキシ共通処理。APIキーはサーバー側だけで扱う。
// 失敗時はCDNにキャッシュさせない（routeRulesのisrはステータスに関係なくキャッシュヘッダーを付けるため）
export const fetchMicroCMS = async (event: H3Event, path: string) => {
  try {
    return await $fetch(`https://${process.env.MICROCMS_SERVICE_DOMAIN}.microcms.io/api/v1/${path}`, {
      headers: { 'X-MICROCMS-API-KEY': process.env.MICROCMS_API_KEY ?? '' },
      query: getQuery(event),
    });
  } catch (error) {
    setResponseHeader(event, 'Netlify-CDN-Cache-Control', 'no-store');
    throw error;
  }
};
