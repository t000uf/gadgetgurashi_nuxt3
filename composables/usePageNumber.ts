// 一覧の /page/:p を正の整数として読む。/page/abc や /page/0 は1ページ目に丸めず404にする
export const usePageNumber = () => {
  const page = Number(useRoute().params.p ?? 1);
  if (!Number.isInteger(page) || page < 1) {
    throw createNotFoundError();
  }
  return page;
};
