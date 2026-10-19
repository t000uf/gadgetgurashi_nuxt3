# 0005. キャッシュを routeRules の isr（Netlify CDN）に一本化する

- ステータス: 承認済み
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
- 下書きプレビュー（`/draft`・`/api/draft`）は `isr: false` で除外する
- API の個別の `Cache-Control` は削除し、microCMS 呼び出しを `server/utils/microcms.ts` の
  `fetchMicroCMS` に集約する。失敗時は `Netlify-CDN-Cache-Control: no-store` を付けてエラーをキャッシュさせない
- ページ側も、5xx でエラーページを返すときは同じく `no-store` にする（`composables/throwIfNotFound.ts`）。
  404 はキャッシュしてよい

## 影響

- 初回アクセス・クローラーも含めて、60 秒以内の同じ URL へのリクエストは関数を起動せず CDN から返る
- 60 秒を過ぎた後のリクエストは古いレスポンスを即座に返し、裏で再生成する。CMS の更新は
  最大で「60 秒＋次の 1 リクエスト」遅れて反映される。デプロイ時はキャッシュが破棄される
- ブラウザ側には `Cache-Control: public, max-age=0, must-revalidate` が付く（ブラウザにはキャッシュさせない）
- 新しくキャッシュしてはいけないルート（プレビュー系・認証系）を作るときは、`routeRules` に `isr: false` を足すこと
