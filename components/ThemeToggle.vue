<script lang="ts" setup>
// ライト／ダークの切り替え。PC・タブレットはトグルスイッチ、SPはアイコンボタンにする
// （SPのナビピルは狭く、スイッチを置くとHOMEともども押しにくくなるため）。
// - スイッチ：つまみは現在のテーマ側（左＝ライト／右＝ダーク）、中のアイコンも現在のテーマ
// - アイコンボタン：押すと切り替わる先を示す（ライト表示中は月、ダーク表示中は太陽）
// サーバーはテーマを知らないので、出し分けはすべてCSS（dark-mode mixin）で行う。
// 押せる範囲はどちらもナビのピルの高さいっぱいに取る
const { current, toggle } = useTheme()

// 支援技術向けのオン／オフ（オン＝ダーク）。SSR時点では分からないので、マウントまでは出さない
const isDark = ref<boolean>()
const sync = () => {
  isDark.value = current() === 'dark'
}
// 手動で選んでいない間は、OSの配色の切り替えで見た目（CSS）が変わるので追従させる
let colorScheme: MediaQueryList | undefined
onMounted(() => {
  sync()
  colorScheme = window.matchMedia('(prefers-color-scheme: dark)')
  colorScheme.addEventListener('change', sync)
})
onUnmounted(() => colorScheme?.removeEventListener('change', sync))
const onClick = () => {
  isDark.value = toggle() === 'dark'
}
</script>

<template>
  <button type="button" role="switch" class="theme-toggle" aria-label="ダークモード" :aria-checked="isDark"
    @click="onClick">
    <span class="theme-toggle__track">
      <span class="theme-toggle__knob">
        <AppIcon name="sun" :size="14" class="theme-toggle__light" />
        <AppIcon name="moon" :size="14" class="theme-toggle__dark" />
      </span>
    </span>
    <span class="theme-toggle__button">
      <AppIcon name="moon" :size="20" class="theme-toggle__light" />
      <AppIcon name="sun" :size="20" class="theme-toggle__dark" />
    </span>
  </button>
</template>

<style lang="scss" scoped>
$track-width: 48px;
$track-height: 26px;
$knob-size: 20px;
$knob-inset: 3px; // (track-height - knob-size) / 2

.theme-toggle {
  display: flex;
  align-items: center;
  justify-content: center;
  align-self: stretch;
  padding: 0;
  border: none;
  background: none;
  color: $color-nav-inactive;
  cursor: pointer;
  // テーマ切り替えのクロスフェード（global.scss）から外し、つまみのスライドをそのまま見せる
  view-transition-name: theme-toggle;
}

.theme-toggle__track {
  position: relative;
  display: block;
  width: $track-width;
  height: $track-height;
  border-radius: $radius-pill;
  background-color: $color-header-border;
  transition: background-color $duration-theme ease;
}

.theme-toggle__knob {
  position: absolute;
  top: $knob-inset;
  left: $knob-inset;
  display: flex;
  align-items: center;
  justify-content: center;
  width: $knob-size;
  height: $knob-size;
  border-radius: 50%;
  background-color: $color-bg;
  color: $color-primary;
  transition: transform $duration-theme cubic-bezier(0.34, 1.56, 0.64, 1), background-color $duration-theme ease;

  @include dark-mode {
    transform: translateX($track-width - $knob-size - $knob-inset * 2);
  }

  @media (prefers-reduced-motion: reduce) {
    transition: none;
  }
}

.theme-toggle__button {
  display: none;
  transition: color 0.2s ease, transform 0.15s ease;
}

// ライト表示中に見せる側／ダーク表示中に見せる側
.theme-toggle__light {
  display: block;

  @include dark-mode {
    display: none;
  }
}

.theme-toggle__dark {
  display: none;

  @include dark-mode {
    display: block;
  }
}

@media screen and (max-width: $bp-sm) {
  // HOME（.header__link--home）と同じ40pxの正方形をタップ範囲にする
  .theme-toggle {
    width: 40px;

    &:hover .theme-toggle__button {
      color: $color-base;
    }

    &:active .theme-toggle__button {
      transform: scale(0.9);
    }
  }

  .theme-toggle__track {
    display: none;
  }

  .theme-toggle__button {
    display: block;
  }
}
</style>
