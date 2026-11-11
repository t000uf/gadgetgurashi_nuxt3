// エラーのレスポンスがNetlifyのCDNに長く残らないよう、キャッシュヘッダーを上書きする。
// routeRulesのisrはステータスに関係なくキャッシュヘッダーを付ける（ADR 0005）ので、何もしないと
// エラーのレスポンスも「60秒＋stale-while-revalidate」で残ってしまう。
// 呼び出し側ごとに付けると漏れる（描画中の例外など）ので、ここで一括して付ける
export default defineNitroPlugin((nitroApp) => {
  nitroApp.hooks.hook('error', (error, { event }) => {
    if (!event) return;
    const statusCode = (error as { statusCode?: number }).statusCode ?? 500;

    // 5xx（一時的な障害）はキャッシュしない
    if (statusCode >= 500) {
      setResponseHeader(event, 'Netlify-CDN-Cache-Control', 'no-store');
      return;
    }

    // 4xx は同じURLなら同じ結果になるので短くキャッシュしてよいが、stale-while-revalidate は外す。
    // 残したままだと、公開前の記事URLに一度アクセスがあった場合、公開後も最初の1リクエストには
    // 古い404が返る（それがクローラーなら404として扱われる）
    setResponseHeader(event, 'Netlify-CDN-Cache-Control', 'public, max-age=60, durable');
  });
});
