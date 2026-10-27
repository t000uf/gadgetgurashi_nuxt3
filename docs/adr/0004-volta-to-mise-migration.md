# 0004. Node.jsバージョン管理をVoltaからmiseに移行

- ステータス: 承認済み
- 日付: 2026-09-08

## コンテキスト

これまで `package.json` の `volta.node` フィールドでNode.jsバージョン
（`24.14.1`）を固定していた。加えて、実際には使っていない `.yarnrc.yml` が
残っており、パッケージマネージャの指定が `packageManager: pnpm@10.33.0` と
混在していた。

## 決定

- Node.jsバージョン管理を Volta から **mise** に移行する。`package.json` から
  `volta` フィールドを削除し、`.mise.toml` に

  ```toml
  [tools]
  node = "24.14.1"
  ```

  を追加する。
- 使っていない `.yarnrc.yml` を削除する（パッケージマネージャは pnpm 固定。
  `package.json` の `engines` で npm / yarn の使用を弾いている）。

## 影響

- 開発者は mise（`mise install` 等）でNode.jsバージョンを揃える。Voltaのインストール・
  設定は不要になる。
- Yarn関連の設定ファイルが無くなったことで、pnpm以外のパッケージマネージャが
  誤って使われる余地がさらに減る。
