export const useThumbnail = () => {
  /** microCMSの画像APIのクエリで表示幅に応じたサイズに制限する（元画像をそのまま配信しない） */
  const thumbnailUrl = (url: string | undefined, width: number) => {
    if (!url) return url;
    return `${url}?w=${width}&fm=webp`;
  };

  return { thumbnailUrl };
};
