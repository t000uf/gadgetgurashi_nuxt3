import type { H3Event } from 'h3';

// microCMSへのプロキシ共通処理。APIキーはサーバー側だけで扱う。
// queryを省略したときは、受けたリクエストのクエリをそのまま渡す
export const fetchMicroCMS = async <T = unknown>(
  event: H3Event,
  path: string,
  query: Record<string, unknown> = getQuery(event),
): Promise<T> => {
  try {
    // 外部URLなので、Nitroの内部ルートの型推論は効かない（戻り値の型は呼び出し側で指定する）
    return (await $fetch(`https://${process.env.MICROCMS_SERVICE_DOMAIN}.microcms.io/api/v1/${path}`, {
      headers: { 'X-MICROCMS-API-KEY': process.env.MICROCMS_API_KEY ?? '' },
      query,
    })) as T;
  } catch (error) {
    // 該当なし（404）だけはそのまま返す。APIキーの失効（401/403）やレート制限（429）などを
    // そのまま返すと、サイトのページが「存在しない」扱いになるので、上流の失敗（502）にまとめる
    const upstreamStatus = (error as { statusCode?: number }).statusCode;
    if (upstreamStatus === 404) {
      throw createError({ statusCode: 404, cause: error });
    }
    console.error(`[microCMS] ${path} の取得に失敗しました`, error);
    // routeRulesのisrはステータスに関係なくキャッシュヘッダーを付けるので、一時的な失敗をCDNに残さない
    setResponseHeader(event, 'Netlify-CDN-Cache-Control', 'no-store');
    throw createError({ statusCode: 502, cause: error });
  }
};
