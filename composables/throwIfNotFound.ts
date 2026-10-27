import type { Ref } from 'vue';

// 404のエラー。SSRではfatalでなくてもエラーページになり、fatalにするとNitroが
// [fatal] としてログに出してしまう（存在しないURLへのアクセスで本当の障害が埋もれる）。
// クライアント遷移ではfatalにしないとエラーページに切り替わらないので、そちらだけfatalにする
export const createNotFoundError = () => createError({ statusCode: 404, fatal: import.meta.client });

// useFetchの失敗・空データをエラーページへ回す。
// 何もしないと空のページが200で返り、soft 404としてインデックスに残る
export const throwIfNotFound = (
  error: Ref<{ statusCode?: number } | null | undefined>,
  data: Ref<unknown>,
) => {
  if (error.value) {
    const statusCode = error.value.statusCode ?? 500;
    if (statusCode === 404) {
      throw createNotFoundError();
    }
    // 一時的な障害をCDNにキャッシュさせない（キャッシュしてよいのは404だけ）
    if (import.meta.server) {
      useResponseHeader('Netlify-CDN-Cache-Control').value = 'no-store';
    }
    throw createError({ statusCode, fatal: true, cause: error.value });
  }
  if (!data.value) {
    throw createNotFoundError();
  }
};
