// 5xxのレスポンスをNetlifyのCDNにキャッシュさせない。
// routeRulesのisrはステータスに関係なくキャッシュヘッダーを付ける（ADR 0005）ので、
// 一時的な障害のエラーページやAPIの失敗が、そのまま残ってしまう。
// 呼び出し側ごとに付けると漏れる（描画中の例外など）ので、ここで一括して付ける
export default defineNitroPlugin((nitroApp) => {
  nitroApp.hooks.hook('error', (error, { event }) => {
    const statusCode = (error as { statusCode?: number }).statusCode ?? 500;
    if (event && statusCode >= 500) {
      setResponseHeader(event, 'Netlify-CDN-Cache-Control', 'no-store');
    }
  });
});
