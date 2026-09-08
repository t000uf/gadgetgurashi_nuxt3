# がじぇっとぐらし！

ガジェットレビューブログ [gadgetgurashi.com](https://www.gadgetgurashi.com) のフロントエンド。
Nuxt 4 + microCMS + Netlify。

## セットアップ

パッケージマネージャは **pnpm** を使用します。

```bash
pnpm install
```

`.env` に以下を設定します。

```
MICROCMS_SERVICE_DOMAIN=
MICROCMS_API_KEY=
GA_TRACKING_ID=
```

## 開発

```bash
pnpm dev        # http://localhost:3000
pnpm build      # 本番ビルド
pnpm preview    # ビルド結果の確認
pnpm typecheck  # 型チェック
```

## ドキュメント

- [AGENTS.md](./AGENTS.md) — 構成・規約・環境変数（AIエージェント／新規参加者向け）
- [docs/DESIGN.md](./docs/DESIGN.md) — デザインシステム（v8リブランディング）
- [docs/adr/](./docs/adr/) — アーキテクチャ決定記録（ADR）。フレームワーク移行など経緯を残すべき決定
