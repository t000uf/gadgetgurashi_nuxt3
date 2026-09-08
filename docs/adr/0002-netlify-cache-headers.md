# 0002. server/api/** にCache-Controlを設定してNetlifyのCDNキャッシュを効かせる

- ステータス: 承認済み
- 日付: 2026-09-08

## コンテキスト

[0001](0001-nuxt3-ssr-migration.md) でSSRに移行した結果、SSGの頃と違いリクエストの
たびに `server/api/**` の microCMS プロキシが実行されるようになった。プロキシは
`Cache-Control` を返していなかったため、NetlifyのCDNキャッシュが素通しになり、
毎回 microCMS への実リクエストが発生していた（issue #11）。

## 決定

キャッシュしてよいAPI（`article/index.get.ts`、`article/[id].get.ts`、
`about/[id].get.ts`、`tag/index.get.ts`）に

```ts
setHeader(event, 'Cache-Control', 's-maxage=60, stale-while-revalidate')
```

を設定し、Netlifyのエッジ/CDNキャッシュを有効化する。下書きプレビュー用の
`draft/index.get.ts`（`draftKey` 付きの未公開コンテンツを返す）はキャッシュ対象から
明示的に除外する。

## 影響

- 記事一覧・記事詳細・about・tag のレスポンスは最大60秒キャッシュされ、
  microCMSへのリクエスト数とレイテンシが減る。`stale-while-revalidate` により、
  キャッシュ失効直後のリクエストも古いレスポンスを即返しつつ裏で再検証する。
- 新規に `server/api/**` を追加する際は、レスポンスをキャッシュしてよいか
  （プレビュー系・認証系は不可）を都度判断し、キャッシュ可能なら同様のヘッダーを
  設定すること。
- 更新から最大60秒はCMSの変更が反映されない可能性がある。即時反映が必要な
  ケースが出てきた場合は、キャッシュ時間の短縮やオンデマンド再検証の導入を
  別途検討する。
