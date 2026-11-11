// microCMSのコンテンツID（記事・タグ）として受け付ける形式。英数字・ハイフン・アンダースコアのみ。
// URLから受けた値をそのままAPIのパスや filters / ids に埋めると、`?` `/` `,` などで
// 別のAPIや別の条件を引けてしまう（存在しないURLが中身のあるページとして200で返る）ので、先に弾く。
// ページ（404にする）とサーバーAPI（400/404を返す）の両方で使うので shared/ に置く
export const isContentId = (value: unknown): value is string =>
  typeof value === 'string' && /^[\w-]+$/.test(value);
