import type { MicroCMSListContent } from 'microcms-js-sdk';

export type MicroCMSList<T> = {
  contents: (MicroCMSListContent & T)[];
  totalCount: number;
  offset: number;
  limit: number;
};
