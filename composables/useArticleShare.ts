export type ArticleShare = {
  url: string
  title: string
}

// 記事ページが自分のURL/タイトルを書き込み、サイドバー(PC)がそれを読んでシェアボタンを表示する
export const useArticleShare = () => useState<ArticleShare | null>('article-share', () => null)
