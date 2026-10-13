import type { AmazonProduct } from '@/types/article';

export type BodySegment =
  | { type: 'html'; html: string }
  | { type: 'product'; asin: string };

// 本文中の {{amazon:ASIN}}。リッチエディタが <p> で包んだ場合は <p> ごと取り除く
const SHORTCODE_RE = /(?:<p>\s*)?\{\{amazon:([A-Z0-9]{10})\}\}(?:\s*<\/p>)?/g;

export const useAmazon = () => {
  const { public: config } = useRuntimeConfig();

  /** ASINからアフィリエイトリンクを組み立てる。タグ未設定ならタグなしのURLになる */
  const buildAmazonUrl = (asin: string) => {
    const url = `https://www.amazon.co.jp/dp/${encodeURIComponent(asin)}`;
    const tag = config.amazonAssociateTag;
    return tag ? `${url}?tag=${encodeURIComponent(tag)}` : url;
  };

  /** 本文HTMLを、ショートコードの位置で html / product のセグメントに分割する */
  const splitShortcodes = (html: string | undefined): BodySegment[] => {
    if (!html) return [];
    const segments: BodySegment[] = [];
    let last = 0;
    for (const match of html.matchAll(SHORTCODE_RE)) {
      const index = match.index ?? 0;
      if (index > last) segments.push({ type: 'html', html: html.slice(last, index) });
      segments.push({ type: 'product', asin: match[1] as string });
      last = index + match[0].length;
    }
    if (last < html.length) segments.push({ type: 'html', html: html.slice(last) });
    return segments;
  };

  /** ASINから商品を引く。未登録なら undefined（開発時のみ警告） */
  const findProduct = (products: AmazonProduct[] | undefined, asin: string) => {
    const product = products?.find((p) => p.asin === asin);
    if (!product && import.meta.dev) {
      console.warn(`[amazon] ASIN ${asin} が products に登録されていません`);
    }
    return product;
  };

  return { buildAmazonUrl, splitShortcodes, findProduct };
};
