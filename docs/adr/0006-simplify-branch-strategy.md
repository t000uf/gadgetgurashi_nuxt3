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
- 変更をまとめる役は、バージョンごとに作る `dev/<x.y.z>` が担っていた。ブランチ名が毎回変わるため、
  Dependabot の向き先や CI の対象に固定で指定できない。
- `release/<x.y.z>` でやっていたリリース前の確認は、リリース用の Pull Request に付く
  Netlify のデプロイプレビューで代わりができる。
- v8 からは、本番ブランチを `master` から `production` に切り替える予定だった。

## 決定

- 使うのは `production`（本番）・`develop`（既定ブランチ、次のリリースのまとめ）・作業ブランチ
  （`feature/*` / `fix/*` / `chore/*` / `docs/*`）だけにする。
- `master` / `release/*` / `dev/<x.y.z>` は廃止する。
- リリースは `develop` → `production` の Pull Request で行い、マージ後に `v<x.y.z>` のタグを付ける。
- 緊急の修正は `production` から `fix/#<issue番号>` を切って production に直接マージし、production を develop に取り込む。

具体的な手順は AGENTS.md の「Git / ブランチ」に書く。

## 影響

- リリースのたびに必要だった release ブランチの作成と、本番からの戻しマージがなくなる（緊急修正のときだけ戻す）。
- まとめ役の名前が `develop` に固定されるので、Dependabot の PR（`target-branch: develop`）や CI の対象に指定できる。
  依存の更新は本番に直接入らず、次のリリースで一緒に出る。
- 移行は次の順で行う（いずれも fast-forward で済む）。
  1. master を production に取り込む（v7.1.0 時点の本番を production に揃える）
  2. Netlify の本番ブランチを `production` に切り替える
  3. dev/8.0.0 を develop に取り込む
  4. GitHub の既定ブランチを `develop` に変える（Dependabot は既定ブランチの設定ファイルを読むので、
     ここで初めて動き出す）
  5. 不要になったブランチ（`master`、`release/*`、`dev/*`、マージ済みの作業ブランチ）を削除する
