import type { MicroCMSImage, MicroCMSListContent } from 'microcms-js-sdk';
import type { Tag } from '@/types/tag';

/** 記事に紐付ける Amazon 商品（microCMS のカスタムフィールド） */
export type AmazonProduct = {
  fieldId?: string;
  asin: string;
  title: string;
  image?: MicroCMSImage;
};

export type Article = {
  title?: string;
  thumbnail?: MicroCMSImage;
  preview?: string;
  text?: string;
  tag: (MicroCMSListContent & Tag)[];
  related?: (MicroCMSListContent & Article)[];
  products?: AmazonProduct[];
  /** @deprecated 旧方式（HTML手貼り）。products への移行完了後に削除する */
  affiliate?: string;
};
