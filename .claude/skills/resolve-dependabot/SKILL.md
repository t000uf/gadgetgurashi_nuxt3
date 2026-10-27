---
name: resolve-dependabot
description: Dependabot が develop 向けに出した依存更新PRを棚卸しし、コンフリクト解消（@dependabot rebase）・CI確認・メジャー更新の影響調査を行ったうえで、ユーザーの承認を得て1件ずつマージする。「dependabot のPRを片付けて」「依存更新PRを解決」「dependabot マージ」などで使う。
---

# Dependabot PR の解決

がじぇっとぐらし！リポジトリで Dependabot が出した PR を片付ける手順。
前提の規約は `AGENTS.md`「依存パッケージ・Node.js の更新」「Git / ブランチ」と `.github/dependabot.yml`。

## 守ること

- **マージ前に必ずユーザーの承認を取る**（develop へのマージは取り消しにくい）。調査・rebase 依頼・ローカル検証までは承認なしで進めてよい。
- Dependabot のブランチに**自分でコミットを push しない**。push すると Dependabot がそのPRの rebase をやめる。
  コード修正が必要な更新は、issue を立てて `develop` から `chore/#<issue番号>-<説明>` を切り、その中で更新＋修正を行い、元の Dependabot PR は閉じる。
- マージ方法は既存の運用に合わせて **「Create a merge commit」**（`gh pr merge <n> --merge`）。ブランチはリポジトリ設定で自動削除される。
- `pnpm dev` をポート 3000 で起動しない（ユーザーの手動確認用）。ローカルで動かすなら `pnpm build` → `PORT=3100 pnpm preview`。
- ローカルの `pnpm` は Volta 経由で Volta 側の古い Node（`.mise.toml` と違う）で動くことがあり、`ERR_PNPM_UNSUPPORTED_ENGINE` になったり lockfile の依存解決がずれたりする。
  ローカルで pnpm を叩くときは `mise exec -- npx -y pnpm@<package.json の packageManager の版> <コマンド>` を使い、`pnpm exec node -v` が `.mise.toml` の版になっていることを確かめる。
- Node.js 本体と `@types/node` のメジャーは Dependabot の対象外（手動更新）。このスキルでは扱わない。

## 手順

### 1. 棚卸し

```bash
gh pr list --author app/dependabot --state open \
  --json number,title,headRefName,mergeable,mergeStateStatus,createdAt
```

各PRについて以下を確認し、一覧表にまとめる。

```bash
gh pr view <n> --json title,body,files,mergeable,mergeStateStatus,statusCheckRollup
```

- 種別: `nuxt` / `dev-dependencies` / `dependencies` グループ（minor・patch）か、個別PR（**メジャー**）か、`github-actions` か
- 状態: `mergeable`（`CONFLICTING` / `MERGEABLE`）、CI（`statusCheckRollup` の `build`）
- メジャーなら更新前後のバージョン（PR本文の Release notes / Changelog / Commits を読む）

### 2. コンフリクトの解消

Dependabot PR のコンフリクトは、ほぼ別PRのマージで `package.json` / `pnpm-lock.yaml` がずれたことによるもの。
自分で解消せず、Dependabot に作り直させる。

```bash
gh pr comment <n> --body "@dependabot rebase"
```

- rebase 後に CI が走る。`gh pr checks <n> --watch` で待つ（チェックが空のままなら、まだ rebase 待ち）。
- rebase で直らない・「edited by someone other than Dependabot」と言われたら `@dependabot recreate`。
- コンフリクトしているのに「already up-to-date with develop」と返されることがある（Dependabot 側の判定が古い）。
  `git merge-base --is-ancestor origin/develop origin/<ブランチ>` で develop を含んでいないことを確かめ、`@dependabot recreate` する。
- **1件マージすると残りがまたコンフリクトする**ので、rebase 依頼は「次にマージするPR」に対して出し、1件ずつ進める。

### 3. 判定

| 種別 | 判定基準 |
|---|---|
| minor / patch のグループ（nuxt / dev-dependencies / dependencies） | CI（`pnpm install --frozen-lockfile` / `typecheck` / `build`）が緑ならマージ候補 |
| github-actions のグループ | CI が緑ならマージ候補。メジャーが含まれる場合は入力値・非推奨の変更を release notes で確認 |
| メジャー（個別PR） | 下の「メジャー更新の調査」を行ってから判断 |

#### メジャー更新の調査

1. **そもそも使っているか**を確認する。使っていない依存なら、更新ではなく削除を提案する。
   ```bash
   grep -rn "<パッケージ名>" --include=*.ts --include=*.vue --include=*.js --include=*.mjs \
     --exclude-dir=node_modules --exclude-dir=.nuxt --exclude-dir=.output .
   ```
   （例: Nuxt 4 は Vite でビルドするので、webpack 用の `sass-loader` などは不要な可能性が高い）
2. PR本文の release notes / CHANGELOG / migration guide から破壊的変更を洗い出し、このリポジトリの使い方（`nuxt.config.ts` の設定、呼び出し箇所）に当たるかを確認する。
3. 必要ならローカルで検証する。
   ```bash
   gh pr checkout <n>
   P="mise exec -- npx -y pnpm@10.33.0"   # Volta の pnpm を避ける（「守ること」参照）
   $P install --frozen-lockfile
   $P typecheck && $P build
   git switch develop   # 終わったら戻る
   ```
4. ランタイムの挙動が変わりうる更新（Nuxt モジュール、計測タグ、SSR に関わるもの）は、Netlify のデプロイプレビューでの確認をユーザーに依頼する（PRのチェック／コメントにプレビューURLが出る）。
5. コード修正が必要なら、上の「守ること」のとおり chore ブランチで対応する方針をユーザーに提案する。

### 4. ユーザーへの報告と承認

次の形でまとめ、どれをマージするか承認を取る。

| PR | 内容 | 種別 | CI | 判定 | 補足 |
|---|---|---|---|---|---|
| #48 | dev-dependencies 3件 | minor/patch | ✅ | マージ可 | |
| #50 | nuxt-gtag 4→5 | メジャー | ✅ | 要確認 | 破壊的変更: … / プレビュー確認待ち |
| #51 | sass-loader 13→17 | メジャー | ✅ | 削除提案 | 未使用 |

### 5. マージ

承認されたものを1件ずつ処理する。

```bash
gh pr checks <n>            # 緑であることを再確認
gh pr merge <n> --merge
```

マージしたら、残りのPRについて手順2（rebase 依頼）→ CI 確認 → マージを繰り返す。
見送るPRは理由をコメントして閉じる（`@dependabot ignore this major version` などで以後の提案も止められる）。
削除することにした依存は、issue を立てて `chore/#<issue番号>-<説明>` で `package.json` から外し、Dependabot PR は閉じる。

### 6. 後片付け

```bash
git switch develop && git pull
```

最後にマージ・見送り・保留にしたPRと、ユーザーが手で確認すべきこと（デプロイプレビューなど）を報告する。
本番への反映は次のリリース（develop → production の PR）で行われる。
