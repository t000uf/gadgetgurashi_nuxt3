# 0001. Nuxt2からNuxt3(SSR)への移行と旧リポジトリの終了

- ステータス: 承認済み
- 日付: 2026-09-08

## コンテキスト

がじぇっとぐらし！は元々 Nuxt2 + `target: 'static'`（SSG、ビルド時に全ページを
静的生成）で運用していた。旧リポジトリは `/Users/t000uf/git(personal)/gadgetgurashi`
（ローカルのみ、GitHub上の対応先は本リポジトリの前身）。

このリポジトリ（`gadgetgurashi_nuxt3`）で Nuxt3 に移行するにあたり、レンダリング方式が
デフォルトの **SSR** になった。SSGと違い、リクエストごとに `server/api/**` の
microCMSプロキシが実行されるため、Netlifyのエッジ/CDNキャッシュが素通しになり
`Cache-Control` を明示しない限りキャッシュが効かない（issue #11、
`feature/#11-netlify-cache` で対応）。

## 決定

- レンダリング方式は Nuxt3 のデフォルトである **SSR** を採用する（SSGへの回帰は行わない）。
  理由: microCMSの記事更新をビルドなしで即時反映したい、下書きプレビュー
  （`pages/draft`）や `tag/[tagId]/page/[p]` のような動的ルートを持つため。
- SSR移行に伴うキャッシュ欠落は、各 `server/api/**` ハンドラで
  `Cache-Control: s-maxage=60, stale-while-revalidate` を明示することで
  Netlify側のCDNキャッシュを効かせる方針とする。下書きプレビュー用API
  （`draft/index.get.ts`）はキャッシュ対象から除外する。
- 旧Nuxt2リポジトリ（`/Users/t000uf/git(personal)/gadgetgurashi`）は
  **メンテナンス終了（EOL）** とする。今後の機能追加・修正はすべて本リポジトリ
  （Nuxt3版）で行い、旧リポジトリへの変更は行わない。

## 影響

- SSR化により記事の即時反映や動的ルートの柔軟性を得られる一方、CDNキャッシュは
  自動ではなく各APIハンドラでの明示的な `Cache-Control` 設定に依存する。
  新規に `server/api/**` を追加する際は、レスポンスをキャッシュしてよいかどうか
  （プレビュー系・認証系は不可）を都度判断し、キャッシュ可能なら同様のヘッダーを
  設定すること。
- 旧Nuxt2リポジトリの資料・実装は本ADRで経緯を記録するのみとし、参照や移植が
  必要な場合は本リポジトリ側にドキュメント化する（旧リポジトリ自体は更新しない）。
