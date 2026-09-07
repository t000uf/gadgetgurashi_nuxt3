# デザインシステム（v8 リブランディング）

Claude Design で決定した方向性を実装に落とし込んだもの。
トーンは「オタク・カジュアル寄り」から「クリーンでテック感のある落ち着いたブログ」へ。
ブランドカラーのオレンジは維持する。

実体は `assets/styles/_tokens.scss`（値）と `assets/styles/_mixins.scss`（見出し・組版）。
**このドキュメントとSCSSトークンが常に一致している状態を保つこと。**

## カラー

| 用途 | 値 | 変数 |
|---|---|---|
| ベース（濃色・ロゴ・見出し） | `#1f2530` | `$color-base` |
| 本文グレー | `#40485a` | `$color-body` |
| メタ情報グレー（日付・パンくず等） | `#6b7488` | `$color-meta` |
| ナビ非アクティブ | `#6b7488` | `$color-nav-inactive` |
| サイト背景 | `#f4f6f8` | `$color-bg` |
| ヘッダー／フッター背景 | `#e6eaef` | `$color-header-bg` |
| ヘッダー境界線 | `#c7cfd9` | `$color-header-border` |
| セクション境界線 | `#d2d9e2` | `$color-border` |
| カード背景 | `#ffffff` | `$color-card` |
| プレースホルダー画像 縞1 / 縞2 | `#dfe4ea` / `#d2d9e2` | `$color-placeholder-1` / `-2` |
| **プライマリ（ブランド）** | `#e8791e` オレンジ | `$color-primary` |
| **セカンダリ（アクセント）** | `#4f74d6` ブルー | `$color-secondary` |

オレンジ＝ブランド／注目表示／見出しアクセント、ブルー＝カテゴリタグ・リンク・二次的な導線。
**この2色以外の新しい色は追加しない。** hover用の `$color-primary-dark` / `$color-secondary-dark` は同系トーンの派生。

`$color-body` / `$color-meta` / `$color-nav-inactive` は初期実装時より濃く調整済み（本文・日付等の
可読性フィードバックへの対応）。淡いグレーはメタ情報であっても最低限のコントラストを確保すること。

## タイポグラフィ

- 見出し・ロゴ・ナビゲーション・ラベル/メタ情報：**Zen Maru Gothic**（500 / 700）
- 本文：**Zen Kaku Gothic New**（400 / 500 / 700 / 900）
- CMS本文中の `<code>` のみ：**JetBrains Mono**（500 / 700）

いずれも Google Fonts（無料）。読み込みは `nuxt.config.ts` の `app.head.link` で行う。

**JetBrains Monoはナビゲーション・ラベル・バッジ等のUIチロームには使わない。** 初期実装ではモノスペースで
統一していたが、和文との相性・可読性の観点からUI文字は全てZen Maru Gothicに統一した。残るのは記事本文
（CMS）中の `<code>` インライン要素のみで、これは意図的な例外（コード表記の慣習に合わせるため）。

日付・パンくず・タグ・eyebrowラベルなど「読ませる短いテキスト」は `@include label($color)` で
Zen Maru Gothic 500 / 15px に統一する（ヘッダーナビと同じ扱い）。ただしカード内の日付・関連記事の
タグチップ・ページネーションの数字・フッターの著作権表記など、絶対的なスペースが小さいUI部品は
`label` mixinを使いつつ `font-size` を12〜14px程度に個別調整してよい（`components/ArticleCard.vue`
の `.card__date` / `.card__tag` 参照）。

## 見出しシステム

サイト全体で最も重要なデザイントークン。mixin として実装済み（`@include heading-1` など）。
CMS本文（v-html）の `h2` / `h3` / `h4` にも `@include article-typography` 経由で同じ規則が適用される。

| レベル | 用途 | 指定 |
|---|---|---|
| H1 | 記事タイトル・ページタイトル | Zen Maru Gothic Bold `clamp(24px, 4vw, 32px)`、直下に**横幅いっぱい**のオレンジ下線バー（高さ4px・角丸2px）。**ページ内で1つだけ** |
| H2 | セクションの区切り | Zen Maru Gothic Bold 20px、左に 5×22px のオレンジバー。CMS本文中では上に1pxの罫線＋64pxの余白でセクションの切れ目を明示 |
| H3 | 小見出し | Zen Maru Gothic Bold 17px、左に 9px 円のオレンジドット |
| H4 | 補足・キャプション見出し | Zen Maru Gothic Bold 15px、左に6px角スクエアのオレンジドット。H3同様のシンプルな行見出しで、背景chip化はしない（リストが連続する箇所で見出しが浮いて見えるため。下線も使わない＝リンクとの混同回避） |

見出し前後の余白は「区切りの分かりやすさ」を優先し、H2は上下64px/16px、H3は上44px/下14pxを確保する
（`assets/styles/_mixins.scss` の `article-typography` 参照）。

## 角丸

- カード全体：14px（`$radius-card`）
- 画像（大）：12px（`$radius-image`）
- 画像（小・グリッド内）：10px（`$radius-image-sm`）
- バッジ / pill / ページネーション丸ボタン：20px または 50%（`$radius-pill`）
- アクセントバー：2px（`$radius-bar`）

## 余白

- カード内パディング：24px 前後を基本単位（`$space-card`）
- 記事グリッドの gap：16px（`$space-grid`）
- セクション間の区切り：1〜2px の罫線＋18〜32px の余白

## 画面

### ヘッダー（全ページ共通・fixed / 高さ56px）
背景 `$color-header-bg`、下端に1pxの境界線。左＝ロゴマーク（角丸スクエア＋circle）＋ロゴタイプ「がじぇっとぐらし！」、
右＝`HOME` / `ABOUT`（Zen Maru Gothic 500, 15px）。
現在のページのリンクはオレンジ＋bold＋下に2pxのアクティブバー、非アクティブは `$color-nav-inactive`。
フッターのHOME/ABOUT/PAGE TOPも同じ書体・サイズで統一。

### トップページ（`pages/index.vue` / `layouts/home.vue`）
1. ヒーロー画像（角丸12px、`clamp(180px, 32vw, 360px)`）
2. イントロブロック：eyebrowラベル「WELCOME」（Zen Maru Gothic Bold／オレンジ）＋ H1 ＋ 本文 ＋「このブログについて →」
3. 1pxの区切り線
4. 記事一覧セクション（H2）：先頭記事を「注目」バッジ付きの1カラム大カード、以降は2カラムグリッド
5. ページネーション：丸ボタン。現在ページはオレンジ塗り、他はグレー

### 記事一覧（`pages/page/[p].vue` / `pages/tag/[tagId]/page/[p].vue`）
パンくず（Zen Maru Gothic 15px）＋ H1 ＋ 件数などのメタ ＋ 2カラムグリッド ＋ ページネーション。

### 記事詳細（`pages/article/[id].vue`）
パンくず「TOP / カテゴリ」→ アイキャッチ（角丸12px・左上にカテゴリバッジ＝ブルーpill）→ H1＋オレンジ下線バー →
メタ情報（日付・更新日・読了◯分）→ 本文 → タグ → 関連商品リンク → 2pxの区切り線 → 「シェアする →」（右寄せ・ブルー）→
RELATED（ラベル＋2カラムのサムネイル付き関連記事。各カードにタグも表示する）。

## カードとバッジのルール

- 記事カードは画像・タイトル・日付のみ。**背景の色塗りやドロップシャドウは使わない**
- バッジは必ず画像に重ねる（pill形状）。注目＝オレンジ、カテゴリ＝ブルー
- hover は画像のわずかな拡大とタイトルのオレンジ化のみ

## 未確定・今後の作業

- ロゴマーク／ロゴタイプは仮置き（`components/BrandLogo.vue`）。別途デザインを詰める
- 記事のアイキャッチは実写に差し替え前提。未設定時は縞模様のプレースホルダー（`@include placeholder-stripe`）が出る
- ヒーロー画像は既存の `assets/imgs/DSCF1982.jpg` を流用中。「物撮り風 product shot」への差し替えを想定
- ホバー／フォーカス状態はモックで未定義のため、実装側で `:focus-visible` にオレンジのアウトラインを定義した
