# 0005. キャッシュを routeRules の isr（Netlify CDN）に一本化する

- ステータス: 承認済み（[0002](0002-netlify-cache-headers.md) を置き換える）
- 日付: 2026-10-19

## コンテキスト

[0002](0002-netlify-cache-headers.md) では `server/api/**` のレスポンスに
`Cache-Control: s-maxage=60, stale-while-revalidate` を付けて、microCMS へのリクエストを
減らそうとした。v8 のレビュー（issue #39）で、次の理由から狙いどおりに効いていないことが分かった。

- SSR 中の `useFetch('/api/...')` は Nitro のハンドラを内部で直接呼ぶので、CDN を通らない。
  ページの HTML 自体にはキャッシュヘッダーがないため、初回アクセスやクローラーのたびに
  microCMS が呼ばれていた。効いていたのはクライアント遷移時の `/api/*` 取得だけ
- `stale-while-revalidate` に秒数がなく、無効なディレクティブになっていた
- ヘッダーを `$fetch` の前に付けていたため、microCMS のエラーレスポンスもキャッシュされ得た

## 決定

- `nuxt.config.ts` の `routeRules` で `'/**': { isr: 60 }` を指定し、ページと API の両方を
  Netlify の CDN でキャッシュする。Nitro の Netlify preset がこれを
  `Netlify-CDN-Cache-Control: public, max-age=60, stale-while-revalidate=31536000, durable` に変換する
- 下書きプレビュー（`/draft`・`/api/draft`）は `isr: false` で除外する。サイトマップ（`/sitemap.xml`）も、
  @nuxtjs/sitemap が記事の取得に失敗しても記事の抜けた一覧を 200 で返すため `isr: false` にし、
  モジュール自身のキャッシュも `sitemap.cacheMaxAgeSeconds: 0` で止める（既定の本番値 600 秒では、
  関数のメモリと `Cache-Control: s-maxage=600` で失敗時の一覧が10分以上残る）
- isr を有効にするとページのデータが `_payload.json` に切り出され、HTML と別々にキャッシュ・再生成される。
  その取得失敗はブラウザで黙って無視されるため、`experimental.payloadExtraction: false` で HTML に埋め込む
- API の個別の `Cache-Control` は削除し、microCMS 呼び出し（API プロキシ・下書き・RSS・サイトマップの URL 生成）を
  `server/utils/microcms.ts` の `fetchMicroCMS` に集約する。microCMS の 404・400 はそのまま返し、
  それ以外の失敗（401/403/429/5xx・タイムアウト）は 502 にまとめる。401/403 は閲覧者側の問題ではなく
  APIキーの失効など上流の失敗なので、そのまま返すと閲覧者やクローラーに誤ったステータスが伝わるため
- 5xx のレスポンスは、Nitro の `error` フック（`server/plugins/no-store-on-error.ts`）で一括して
  `Netlify-CDN-Cache-Control: no-store` にする。呼び出し側ごとに付けると、描画中の例外などで漏れるため。
  4xx は同じ URL なら同じ結果になるのでキャッシュしてよい
- トップページの見出し文・ヒーロー画像（`/api/top`）は取得に失敗しても既定値で表示を続けるが、
  エラーではないのでフックを通らない。そのページは `pages/index.vue` で個別に `no-store` にする

## 影響

- 初回アクセス・クローラーも含めて、60 秒以内の同じ URL へのリクエストは関数を起動せず CDN から返る
- 60 秒を過ぎた後のリクエストは古いレスポンスを即座に返し、裏で再生成する。CMS の更新は
  最大で「60 秒＋次の 1 リクエスト」遅れて反映される。デプロイ時はキャッシュが破棄される
- isr の対象ルートでは、ブラウザ側に `Cache-Control: public, max-age=0, must-revalidate` が付く（ブラウザにはキャッシュさせない）
- 新しくキャッシュしてはいけないルート（プレビュー系・認証系）を作るときは、`routeRules` に `isr: false` を足すこと
