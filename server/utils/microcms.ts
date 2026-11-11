import type { H3Event } from 'h3';
import type { FetchError } from 'ofetch';

// 応答がないまま関数のタイムアウト（ログも残らない）まで待たないよう、先に打ち切る。
// トップページは top → article を直列に呼ぶので、2回分が関数の上限（Netlifyの既定は10秒）に収まる値にする。
// @nuxtjs/sitemap がソースの取得を打ち切る5秒よりも短くして、失敗の原因がこちらのログに残るようにする
const TIMEOUT_MS = 4_000;

// 受けたリクエストのクエリから、そのAPIで使うキーだけを取り出す。
// 丸ごと渡すと、draftKey（下書きがisrでキャッシュされる）や任意の filters・limit を外から指定できてしまう
export const pickQuery = (event: H3Event, keys: readonly string[]) => {
  const query = getQuery(event);
  return Object.fromEntries(keys.filter((key) => query[key] !== undefined).map((key) => [key, query[key]]));
};

// microCMSへの呼び出し共通処理。APIキーはサーバー側だけで扱う。
// クエリは呼び出し側で明示する（リクエストから渡すときは pickQuery で許可したキーだけにする）
export const fetchMicroCMS = async <T = unknown>(
  path: string,
  query: Record<string, unknown> = {},
): Promise<T> => {
  try {
    // 外部URLなので、Nitroの内部ルートの型推論は効かない（戻り値の型は呼び出し側で指定する）
    return (await $fetch(`https://${process.env.MICROCMS_SERVICE_DOMAIN}.microcms.io/api/v1/${path}`, {
      headers: { 'X-MICROCMS-API-KEY': process.env.MICROCMS_API_KEY ?? '' },
      query,
      timeout: TIMEOUT_MS,
      // ofetchはGETの失敗（5xx・429・タイムアウト）を既定で1回再試行するので、待ち時間が倍になる。
      // 上のタイムアウトの計算が崩れるので再試行しない
      retry: 0,
    })) as T;
  } catch (error) {
    // ログにはURLを出さない（下書きのdraftKeyがクエリに入っているため）。
    // microCMSのエラー理由は応答本文（data）にある
    const { statusCode, data, cause } = error as FetchError;

    // 404（該当なし）と400（クエリの誤り）はリクエスト側の問題なので、そのまま返す。
    // ただし一覧・オブジェクトAPI（パスにidを含まないもの）の404は、記事がないのではなく
    // APIの削除・改名などの設定ミスなので、気づけるよう残す
    if (statusCode === 404 || statusCode === 400) {
      if (statusCode === 400 || !path.includes('/')) {
        console.warn(`[microCMS] ${path} が ${statusCode} を返しました`, data);
      }
      throw createError({ statusCode });
    }

    // APIキーの失効（401/403）・レート制限（429）・障害（5xx）・タイムアウトは閲覧者側の問題ではないので、
    // 上流の失敗（502）にまとめる。そのまま返すと閲覧者やクローラーに「認証が必要」「アクセス禁止」と
    // 誤って伝わる。CDNにキャッシュさせない処理は server/plugins/no-store-on-error.ts
    console.error(`[microCMS] ${path} の取得に失敗しました（${statusCode ?? '応答なし'}）`, data ?? cause);
    throw createError({ statusCode: 502 });
  }
};
