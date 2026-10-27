export const useArticleMeta = () => {
  /** 本文HTMLからおおよその読了時間（分）を算出する。日本語は約500文字/分で計算 */
  const readingTime = (html: string | undefined) => {
    if (!html) return 0;
    const text = html.replace(/<[^>]*>/g, '').replace(/\s+/g, '');
    return Math.max(1, Math.round(text.length / 500));
  };

  return { readingTime };
};
