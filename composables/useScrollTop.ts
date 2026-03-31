export const useScrollTop = () => {
  const returnTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  return { returnTop };
};
