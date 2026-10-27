import type { H3Event } from 'h3';
import type { FetchError } from 'ofetch';

// 応答がないまま関数のタイムアウト（ログも残らない）まで待たないよう、先に打ち切る
const TIMEOUT_MS = 10_000;

// microCMSへの呼び出し共通処理。APIキーはサーバー側だけで扱う。
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
      timeout: TIMEOUT_MS,
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
