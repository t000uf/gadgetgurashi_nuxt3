import type { MicroCMSObjectContent } from 'microcms-js-sdk';
import type { Top } from '@/types';

// layouts/home.vue（ヒーロー画像）と pages/index.vue（見出し文）の両方から参照する。
// 同じkeyでuseFetchするとリクエスト・キャッシュが共有され、二重取得にならない
export const useTopContent = () => {
  return useFetch<MicroCMSObjectContent & Top>('/api/top', { key: 'top' });
};
