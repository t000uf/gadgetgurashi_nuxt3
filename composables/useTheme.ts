type Theme = 'light' | 'dark';

// nuxt.config.ts のインラインscript（初回描画前に data-theme を復元する）と同じキーを使うこと
const STORAGE_KEY = 'theme';

// 配色テーマの手動切り替え。未選択のあいだはOS設定に従う（CSS側の prefers-color-scheme）。
// 選んだ結果は <html data-theme> に持ち、表示の出し分けは dark-mode mixin で行う
// （サーバーはテーマを知らないので、テンプレートでは現在のテーマに依存させない）

// startViewTransition のコールバック（DOMへの反映）は次のフレームで走る。
// 反映前にもう一度押されたら、DOMではなくこちらを見て正しく反転させる
let pending: Theme | null = null;

export const useTheme = () => {
  const current = (): Theme => {
    if (pending) return pending;
    const selected = document.documentElement.dataset.theme;
    if (selected === 'light' || selected === 'dark') {
      return selected;
    }
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  };

  const apply = (theme: Theme) => {
    document.documentElement.dataset.theme = theme;
  };

  const toggle = (): Theme => {
    const next: Theme = current() === 'dark' ? 'light' : 'dark';
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // プライベートブラウズ等で保存できなくても、このページ内の切り替えは効かせる
    }

    // 対応ブラウザでは画面全体をクロスフェードさせる（長さは _tokens.scss の $duration-theme）
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduceMotion || !document.startViewTransition) {
      apply(next);
      return next;
    }
    pending = next;
    const transition = document.startViewTransition(() => apply(next));
    transition.updateCallbackDone.finally(() => {
      if (pending === next) pending = null;
    });
    return next;
  };

  return { current, toggle };
};
