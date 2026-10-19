// サーバー（Netlify Functions は UTC）とブラウザで日付がずれないよう、タイムゾーンを日本時間に固定する。
// ずれるとJST 0〜9時の投稿でSSRとハイドレーション後の日付が食い違う
const dateFormatter = new Intl.DateTimeFormat('ja-JP', {
  timeZone: 'Asia/Tokyo',
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
});

export const useDate = () => {
  /** 2026.08.14 形式（カード・記事メタ情報） */
  const formatDot = (date: string | undefined) => {
    if (!date) return '';
    const parts = Object.fromEntries(
      dateFormatter.formatToParts(new Date(date)).map((part) => [part.type, part.value]),
    );
    return `${parts.year}.${parts.month}.${parts.day}`;
  };

  return { formatDot };
};
