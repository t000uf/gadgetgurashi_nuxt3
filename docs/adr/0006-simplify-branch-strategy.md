# 0006. ブランチ運用を git-flow から簡素化する

- ステータス: 承認済み
- 日付: 2026-10-27

## コンテキスト

git-flow をベースに、`master`（本番）・`develop`・`dev/<x.y.z>`・`release/<x.y.z>`・
`production` と作業ブランチを使い分けていた。実際の流れは
「作業ブランチ → `dev/<x.y.z>` → `release/<x.y.z>` → `master` → `develop`（戻しマージ）」で、
次の点で個人リポジトリには過剰になっていた。

- `develop` から作業ブランチを切ったことがなく、master からの戻しマージ（PR #14, #30）だけが行われていた。
  7.1.0 以降は更新も止まっている。
- `dev/<x.y.z>` が git-flow の develop の役割（変更をまとめる場所）をすでに担っている。
- `release/<x.y.z>` でやっていたリリース前の確認は、`dev/<x.y.z>` → `master` の Pull Request に付く
  Netlify のデプロイプレビューで代わりができる。
- `production` は 2026-09-07 以降更新されていない。

## 決定

- 使うのは `master`（本番）・`dev/<x.y.z>`（リリース単位のまとめ）・作業ブランチ
  （`feature/*` / `fix/*` / `chore/*` / `docs/*`）だけにする。
- `develop` / `release/*` / `production` は廃止する。
- リリースは `dev/<x.y.z>` → `master` の Pull Request で行い、マージ後に `v<x.y.z>` のタグを付ける。
- 緊急の修正は `master` から `fix/#<issue番号>` を切って master に直接マージし、開発中の `dev/*` に master を取り込む。

具体的な手順は AGENTS.md の「Git / ブランチ」に書く。

## 影響

- リリースのたびに必要だった release ブランチの作成と develop への戻しマージがなくなる。
- Dependabot の PR は既定ブランチの `master` に来るため、開発中の `dev/*` とは別に本番へ入る。
  `dev/*` 側には master を取り込んで反映する。
- 不要になったブランチ（`develop`、`release/*`、`production`、過去の `dev/7.*`）は、
  Netlify の本番ブランチ設定が `master` であることを確かめてから削除する。
