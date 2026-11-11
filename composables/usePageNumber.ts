// 一覧の /page/:p を正の整数として読む。/page/abc や /page/0 は1ページ目に丸めず404にする。
// Number() で判定すると /page/02・/page/2.0・/page/1e1・/page/0x2 も通り、同じ内容が別のURL（別のcanonical）で
// 200になるので、文字列のまま判定する。桁数の上限（9999ページ）は、極端な値（指数表記になる・精度が落ちる）を
// offset として microCMS に渡さず、呼ぶ前に404にするため
export const usePageNumber = () => {
  const raw = useRoute().params.p;
  if (typeof raw !== 'string' || !/^[1-9]\d{0,3}$/.test(raw)) {
    throw createNotFoundError();
  }
  return Number(raw);
};
