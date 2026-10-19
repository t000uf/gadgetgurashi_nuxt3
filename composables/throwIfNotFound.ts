import type { Ref } from 'vue';

// useFetchの失敗・空データをエラーページへ回す。
// 何もしないと空のページが200で返り、soft 404としてインデックスに残る
export const throwIfNotFound = (
  error: Ref<{ statusCode?: number } | null | undefined>,
  data: Ref<unknown>,
) => {
  if (error.value) {
    const statusCode = error.value.statusCode ?? 500;
    // 一時的な障害をCDNにキャッシュさせない（404はキャッシュしてよい）
    if (import.meta.server && statusCode >= 500) {
      useResponseHeader('Netlify-CDN-Cache-Control').value = 'no-store';
    }
    throw createError({ statusCode, fatal: true });
  }
  if (!data.value) {
    throw createError({ statusCode: 404, fatal: true });
  }
};
