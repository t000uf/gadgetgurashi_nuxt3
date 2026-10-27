import type { Ref } from 'vue';

// 404のエラー。SSRではfatalでなくてもエラーページになり、fatalにするとNitroが
// [fatal] としてログに出してしまう（存在しないURLへのアクセスで本当の障害が埋もれる）。
// クライアント遷移ではfatalにしないとエラーページに切り替わらないので、そちらだけfatalにする
export const createNotFoundError = () => createError({ statusCode: 404, fatal: import.meta.client });

// useFetchの失敗・空データをエラーページへ回す。
// 何もしないと空のページが200で返り、soft 404としてインデックスに残る。
// 5xxをCDNにキャッシュさせない処理は server/plugins/no-store-on-error.ts で一括して行う
export const throwIfNotFound = (
  error: Ref<{ statusCode?: number } | null | undefined>,
  data: Ref<unknown>,
) => {
  if (error.value) {
    const statusCode = error.value.statusCode ?? 500;
    if (statusCode === 404) {
      throw createNotFoundError();
    }
    throw createError({ statusCode, fatal: true, cause: error.value });
  }
  if (!data.value) {
    throw createNotFoundError();
  }
};
