# AGENTS.md

がじぇっとぐらし！（https://gadgetgurashi.com ）の Nuxt 4 ブログ。
AIエージェント／新しく参加する人が最初に読むファイル。

## 技術スタック

- Nuxt 4（SSR、Netlify にデプロイ。旧来の `app/` なしのディレクトリ構成のまま）
- TypeScript（`strict: true`。ビルド時の型チェックは無効、`pnpm typecheck` で別途実行）
- SCSS（scoped style + `assets/styles` のトークン／mixin）
- microCMS（記事・タグ・aboutのヘッドレスCMS）
- Google AdSense / Google Analytics（`nuxt-gtag`）/ `@nuxtjs/sitemap`

## コマンド

**パッケージマネージャは pnpm 固定**（`package.json` の engines で npm / yarn を弾いている）。

```bash
pnpm install
pnpm dev        # http://localhost:3000
pnpm build      # 本番ビルド
pnpm preview    # ビルド結果をローカルで確認
pnpm typecheck  # vue-tsc --noEmit
pnpm lint       # ⚠️ 現状動かない（後述）
```

変更後は最低限 `pnpm typecheck` と `pnpm build` を通すこと。

## 環境変数（`.env`、コミット禁止）

| 変数 | 用途 |
|---|---|
| `MICROCMS_SERVICE_DOMAIN` | microCMS のサービスドメイン |
| `MICROCMS_API_KEY` | microCMS の APIキー |
| `GA_TRACKING_ID` | Google Analytics |

APIキーはクライアントに出さないため、microCMS へのアクセスは必ずサーバー側（`server/api/**`・`server/routes/**`）で行う。
ページからは `useFetch('/api/article')` のように自前のAPIを叩くこと。
サーバー側から microCMS を呼ぶときは、必ず `server/utils/microcms.ts` の `fetchMicroCMS` を使う
（エラー時のステータスの変換・ログ・タイムアウトをまとめている）。

ページで `useFetch` したら `throwIfNotFound(error, data)` を呼ぶ。取得失敗や該当なしを
そのまま描画すると、空のページが200で返り soft 404 になる。
例外は既定値で表示を続けられるトップの `useTopContent` だけで、失敗時は `no-store` を付けるにとどめている
（`throwIfNotFound` を足すと、見出し文・ヒーロー画像の取得失敗でトップページ全体がエラーになる）。

キャッシュは `nuxt.config.ts` の `routeRules`（Netlify の `isr`）で一括管理する（ADR 0005）。
APIに `Cache-Control` を個別に付けない。プレビュー系など、キャッシュしてはいけないルートは
`isr: false` を足す。5xx を CDN に残さない処理は `server/plugins/no-store-on-error.ts` で一括して行う。

## ディレクトリ

```
assets/styles/   デザイントークン（_tokens.scss）、mixin（_mixins.scss）、グローバル（global.scss）
components/      自動インポートされる単一ファイルコンポーネント
composables/     useDate / useArticleMeta / useArticleShare / useScrollTop / useTheme /
                 useThumbnail / useToc / useTopContent / usePageNumber / throwIfNotFound
layouts/         default（記事・一覧）、home（トップ：ヒーロー付き）
pages/           index / page/[p] / article/[id] / article/about / tag/[tagId]/page/[p] / draft
server/api/      microCMS プロキシ、sitemap のURL生成
server/routes/   RSS（rss.xml）
server/plugins/  5xx を CDN にキャッシュさせない処理
server/utils/    microCMS 呼び出しの共通処理（fetchMicroCMS）
types/           microCMS のレスポンス型
docs/DESIGN.md   デザインシステム（v8リブランディング）
docs/adr/        アーキテクチャ決定記録（ADR）。フレームワーク移行など経緯を残すべき決定
```

## スタイルの規約

- **色・フォント・角丸・余白は必ず `assets/styles/_tokens.scss` の変数を使う。値の直書きは禁止。**
- ライト／ダークの2テーマ。`$color-*` は実色ではなくCSS変数の参照なので、`rgba()` などSassの色関数に
  渡さない。透過は `with-alpha($color-primary, 0.1)` を使う。色を足すときは `$theme-light` / `$theme-dark` の両方に入れる。
- オレンジ／ブルーのベタ塗りに乗る文字は `$color-on-accent`。`#fff` を直書きしない。
- テーマで表示を出し分けるときは `@include dark-mode` を使う。テンプレート（`v-if` など）を現在の
  テーマに依存させない（サーバーはテーマを知らないので、ハイドレーション不整合になる）。
- 見出しは `@include heading-1` 〜 `heading-4` を使う。独自の見出しスタイルを作らない。
- CMS本文（`v-html`）の組版は `@include article-typography` 一択。記事・about・下書きで共有する。
- クラス名は BEM 風（`.card`, `.card__title`, `.card--featured`, 状態は `.is-active`）。
- `_variables.scss` は `_tokens.scss` と `_mixins.scss` を `@forward` するだけのエントリで、
  `nuxt.config.ts` の `additionalData` から全SCSSに自動注入される。**ここにCSSルールを書かない**
  （全コンポーネントに重複出力されるため）。グローバルCSSは `assets/styles/global.scss` に書く。
- デザインの意図は `docs/DESIGN.md` に書いてある。**スタイルを変えたらそちらも更新する。**

## コンポーネントの規約

- `<script lang="ts" setup>` を使う。Nuxtの自動インポート（`ref` / `computed` / `useRoute` など）は import しない。
- リンクは `<NuxtLink>` を要素全体に掛ける。旧実装にあった「透明な `<a>` を `position: absolute` で重ねる」書き方は使わない。
- 画像は未設定の場合を必ず考慮する（`@include placeholder-stripe` のプレースホルダーを出す）。
- 一覧の見た目は `ArticleCard` の `variant`（`featured` / `default` / `compact`）で切り替える。
  新しい見た目が必要なら variant を追加する（別コンポーネントを作らない）。

## Git / ブランチ

git-flow を簡素化した運用（ADR 0006）。`master` / `release/*` / `dev/<x.y.z>` は使わない。

| ブランチ | 役割 | 切り元 → マージ先 |
|---|---|---|
| `production` | 本番（Netlify の本番デプロイ） | — |
| `develop` | 既定ブランチ。次のリリースに入れる変更をまとめる | — → `production` |
| `feature/#<issue番号>-<説明>` | 機能追加 | `develop` → `develop` |
| `fix/#<issue番号>` | 不具合修正 | `develop` → `develop`（緊急時は `production` → `production`） |
| `chore/#<issue番号>-<説明>` / `docs/#<issue番号>-<説明>` | 依存更新・設定・ドキュメント | `develop` → `develop` |

- 作業ブランチは issue ごとに切り、Pull Request で `develop` にマージする。
- リリースは `develop` → `production` の Pull Request で行い、Netlify のデプロイプレビューで確認してからマージする。
  マージ後、production のマージコミットに `v<x.y.z>` のタグを付ける。
- 緊急の修正は `production` から `fix/#<issue番号>` を切って production に直接マージする（パッチを1つ上げてタグを付ける）。
  そのあと production を develop にマージして取り込む。
- production と develop へは必ず Pull Request 経由でマージする（直接 push しない）。

## 依存パッケージ・Node.js の更新

- Node.js のバージョンは `.mise.toml` と `netlify.toml` の `NODE_VERSION` を同じパッチまで揃える。
  `@types/node` のメジャーも Node のメジャーに合わせる。
- Dependabot（`.github/dependabot.yml`）が毎週月曜に npm の更新PRを `develop` 向けに出す。
  minor / patch は `nuxt` 関連・devDependencies・dependencies の3グループにまとめ、メジャーは個別PRになる。
  GitHub Actions のバージョンも月1回、1つのPRにまとめて出す。本番には次のリリースで一緒に出る。
- CI（`.github/workflows/ci.yml`）が、PR ごとと develop / production への push で `pnpm install --frozen-lockfile` /
  `pnpm typecheck` / `pnpm build` を回す。Dependabot のPRもこれが通っていればマージしてよい
  （ランタイムの挙動が変わりうるメジャー更新は、Netlify のデプロイプレビューでも確認する）。

## 既知の問題

- `pnpm lint` が動かない。ESLint 10 は flat config（`eslint.config.js`）必須だが、設定は `.eslintrc` のまま。
  `@nuxtjs/eslint-config-typescript` が flat config 未対応のため、移行するには構成の入れ替えが必要。
- `assets/imgs/` のマテリアルアイコンSVG（`arrow_*`, `home_*`, `upgrade_*`）は
  `components/AppIcon.vue` にパスデータとしてインライン化して使用中（`fill="currentColor"`で
  呼び出し元の色を継承させるため、`url()`/`mask-image`ではなくSVGを直接埋め込んでいる）。
  `sun` / `moon` などは元SVGを置かずに `AppIcon.vue` に直接足したもので、`assets/imgs/` に対応ファイルはない。
  `report_*`, `description_*`, `gadget_life*.png` は v8 デザインで参照されなくなった。
  ロゴ確定後にまとめて整理する。
