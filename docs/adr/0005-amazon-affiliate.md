# 0005. Amazonアフィリエイトを構造化データ+ショートコードに変更

- ステータス: 承認済み（v8リリース後に導入。実装の土台は `feature/#32-products-field`）
- 日付: 2026-10-08

## コンテキスト

これまでは記事の `affiliate`（microCMSのテキストエリア）にAmazonの商品リンク／画像タグの
HTMLを手貼りし、`v-html` で記事末尾に表示していた（Issue #32）。

- 画像URLが外部依存でリンク切れのリスクがある
- 未サニタイズのHTMLをそのまま出力している
- 記事末尾の固定枠にしか置けず、本文中での引用ができない

## 決定

- 商品は構造化データ（`asin` / `title` / `image`）で持つ。画像はmicroCMSのメディアに
  アップロードし、PA-APIは使わない。価格は表示しない（価格変動による誤表示を避ける）
- 本文のリッチエディタに `{{amazon:ASIN}}` と書くと、その位置に商品カード（`AmazonCard`）を
  差し込む。記事末尾の「関連商品リンク」には紐付けた商品を全件表示する
- アソシエイトタグは環境変数 `NUXT_PUBLIC_AMAZON_ASSOCIATE_TAG`（`runtimeConfig.public.amazonAssociateTag`）
- リンクは `https://www.amazon.co.jp/dp/{ASIN}?tag={tag}`、`rel="sponsored nofollow noopener"`
- 商品は microCMS に「商品」API（`asin` / `title` / `image`、任意で `maker`）を新設して一元管理し、
  記事からは複数コンテンツ参照フィールド `products` で紐付ける。`affiliate`（旧HTML手貼り）は廃止する
- microCMS無料枠のAPI数上限のため、**v8リリースと旧About削除の後**に導入する（#33）。
  記事内のリピートフィールドによる暫定運用は行わない（二重入力と移行作業が発生し、v8までの期間も短いため）
- 実装は `feature/#32-products-field` の `AmazonCard` / `useAmazon` / `ArticleDetail` を土台にし、
  `products` の型を参照フィールド（`depth: 2` で展開）に合わせる。`AmazonProduct` 型は変えない

## 影響

- 本文中の引用が可能になり、リンク切れ（画像）は自前のメディアで避けられる
- 同じ商品を複数記事で使っても、商品側を1か所直せば全記事に反映される
- `products` に無いASINのカードは描画されない（開発時のみ警告）
- v8リリースまでは旧方式（`affiliate`）のまま。導入後に `affiliate` フィールドとフォールバック分岐を削除する
