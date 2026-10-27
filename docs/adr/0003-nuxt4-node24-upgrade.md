# 0003. Nuxt4 / Node.js 24系へのアップグレード

- ステータス: 承認済み
- 日付: 2026-09-08

## コンテキスト

Nuxt3系（`nuxt: ^3.21.2`）・Node.js 20系（`20.20.2`）・Netlifyのビルド環境
`NODE_VERSION = "22"` で運用していたが、Nuxt4がリリースされ、Node.jsも
24系がLTSとして利用可能になった。

## 決定

- `nuxt` を `^3.21.2` から `^4.5.2` にアップグレードする（chore/#17-nuxt4-migration, PR #18）。
- Node.js を `20.20.2` から `24.14.1` にアップグレードし、`netlify.toml` の
  `NODE_VERSION` も `22` から `24` に合わせる。

## 影響

- Nuxt4はNuxt3とほぼ互換のAPIを持つため、本移行時点でのアプリケーションコードの
  破壊的な書き換えは発生していない（`package.json` と `netlify.toml` のみ変更）。
- Node.jsバージョンの管理方法自体は本ADRの対象外（[0004](0004-volta-to-mise-migration.md)を参照）。
- 今後 `pnpm typecheck` / `pnpm build` がNode24系を前提にすることになるため、
  ローカル環境のNodeバージョンもこれに合わせる必要がある。
