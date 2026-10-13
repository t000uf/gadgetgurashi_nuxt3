import type { MicroCMSImage, MicroCMSListContent } from 'microcms-js-sdk';
import type { Tag } from '@/types/tag';

export type Article = {
  title?: string;
  thumbnail?: MicroCMSImage;
  preview?: string;
  text?: string;
  tag: (MicroCMSListContent & Tag)[];
  related?: (MicroCMSListContent & Article)[];
  affiliate?: string;
};
