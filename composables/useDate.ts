export const useDate = () => {
  const format = (date: string | undefined) => {
    if (!date) return '';
    return new Date(date).toLocaleDateString('ja', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
  };
  return { format };
};
