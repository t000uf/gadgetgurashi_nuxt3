export const useDate = () => {
  /** 2026/08/14 形式（本文中の「投稿日時」など） */
  const format = (date: string | undefined) => {
    if (!date) return '';
    return new Date(date).toLocaleDateString('ja', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
  };

  /** 2026.08.14 形式（カード・メタ情報のモノスペース表記） */
  const formatDot = (date: string | undefined) => {
    if (!date) return '';
    const d = new Date(date);
    const pad = (n: number) => String(n).padStart(2, '0');
    return `${d.getFullYear()}.${pad(d.getMonth() + 1)}.${pad(d.getDate())}`;
  };

  return { format, formatDot };
};
