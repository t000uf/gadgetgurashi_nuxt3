# AGENTS.md

がじぇっとぐらし！（https://gadgetgurashi.com ）の Nuxt 3 ブログ。
AIエージェント／新しく参加する人が最初に読むファイル。

## 技術スタック

- Nuxt 3（SSR、Netlify にデプロイ）
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

APIキーはクライアントに出さないため、microCMS へのアクセスは必ず `server/api/**` のプロキシ経由で行う。
ページからは `useFetch('/api/article')` のように自前のAPIを叩くこと。

## ディレクトリ

```
assets/styles/   デザイントークン（_tokens.scss）、mixin（_mixins.scss）、グローバル（global.scss）
components/      自動インポートされる単一ファイルコンポーネント
composables/     useDate / useArticleMeta
layouts/         default（記事・一覧）、home（トップ：ヒーロー付き）
pages/           index / page/[p] / article/[id] / article/about / tag/[tagId]/page/[p] / draft
server/api/      microCMS プロキシ、sitemap のURL生成
types/           microCMS のレスポンス型
docs/DESIGN.md   デザインシステム（v8リブランディング）
```

## スタイルの規約

- **色・フォント・角丸・余白は必ず `assets/styles/_tokens.scss` の変数を使う。値の直書きは禁止。**
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

- `master` が本番。`develop` と作業ブランチ（`feature/*`, `fix/#<issue番号>`, `release/*`）を使う。
- master へは Pull Request 経由でマージする。

## 既知の問題

- `pnpm lint` が動かない。ESLint 10 は flat config（`eslint.config.js`）必須だが、設定は `.eslintrc` のまま。
  `@nuxtjs/eslint-config-typescript` が flat config 未対応のため、移行するには構成の入れ替えが必要。
- `assets/imgs/` のマテリアルアイコンSVG（`arrow_*`, `home_*`, `upgrade_*`, `report_*`, `description_*`）と
  `gadget_life*.png` は v8 デザインで参照されなくなった。ロゴ確定後にまとめて整理する。
