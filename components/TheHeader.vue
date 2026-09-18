<script lang="ts" setup>
const route = useRoute()

const isHome = computed(() => route.path === '/')
const isAbout = computed(() => route.path.startsWith('/article/about'))
</script>

<template>
  <header class="header">
    <div class="header__inner">
      <NuxtLink to="/" class="header__brand">
        <BrandLogo :size="26" />
        <span class="header__logotype">がじぇっとぐらし！</span>
      </NuxtLink>
      <nav class="header__nav">
        <NuxtLink
          to="/"
          class="header__link header__link--home"
          :class="{ 'is-active': isHome }"
          aria-label="HOME"
        >
          <AppIcon name="home" :size="20" class="header__link-icon" />
          <span class="header__link-text">HOME</span>
        </NuxtLink>
        <NuxtLink
          to="/article/about"
          class="header__link header__link--about"
          :class="{ 'is-active': isAbout }"
        >ABOUT</NuxtLink>
      </nav>
    </div>
  </header>
</template>

<style lang="scss" scoped>
.header {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 999;
  display: flex;
  justify-content: center;
  width: 100%;
  height: $header-height;
  // ヘッダー本体は透明のまま。重ね順は「ヘッダーのピル > コンテンツ > 背景色 > 背景パターン」。
  // ヘッダー自身に不透明な塗りを持たせるとコンテンツより手前に来てしまうため、
  // 塗りはピル（.header__brand / .header__nav）だけに持たせる
  background: transparent;
}

// container-width は本文＋サイドバーの2カラム分なので、1カラムのSP/タブレットでは
// ピルが本文カラムから離れて間延びする。lgになるまでは本文と同じ幅に収める
.header__inner {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  max-width: $content-width;
  padding: 0 24px;
}

// 背景パターンの上に乗るため、ロゴタイプとナビゲーションはそれぞれ独立した
// 半透明+backdrop-filterのピルとして塗る（ヘッダー全体は透明のまま）
.header__brand {
  @include content-block($color-header-bg, $opacity-header);

  display: flex;
  align-items: center;
  height: 44px;
  gap: 10px;
  padding: 0 20px;
  border-radius: $radius-pill;
  color: $color-base;
  text-decoration: none;
  transition: transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.2s ease;

  &:hover {
    color: $color-base;
    opacity: 0.85;
    transform: translateY(-1px);
  }

  &:active {
    transform: translateY(0) scale(0.97);
    transition-duration: 0.1s;
  }
}

.header__logotype {
  font-family: $font-heading;
  font-weight: 700;
  font-size: 17px;
  line-height: 1;
}

.header__nav {
  @include content-block($color-header-bg, $opacity-header);

  display: flex;
  align-items: center;
  height: 44px;
  gap: 24px;
  padding: 0 24px;
  border-radius: $radius-pill;
}

// 下線バーは常に配置しておき、hover / is-active で幅（scaleX）と色だけを
// 切り替える。中央から左右に伸びるアニメーションにするため transform-origin
// はcenterのまま、位置合わせにtranslateX(-50%)を使う
.header__link {
  position: relative;
  padding-bottom: 4px;
  color: $color-nav-inactive;
  font-family: $font-heading;
  font-weight: 500;
  font-size: 16px;
  text-decoration: none;
  transition: color 0.2s ease, transform 0.15s ease;

  &::after {
    position: absolute;
    bottom: 0;
    left: 50%;
    display: block;
    width: 100%;
    height: 2px;
    border-radius: $radius-bar;
    background-color: $color-nav-inactive;
    content: '';
    transform: translateX(-50%) scaleX(0);
    transform-origin: center;
    transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1), background-color 0.2s ease;
  }

  &:hover {
    color: $color-base;

    &::after {
      transform: translateX(-50%) scaleX(0.55);
    }
  }

  &:active {
    transform: scale(0.96);
  }

  &.is-active {
    color: $color-primary;
    font-weight: 700;

    &::after {
      background-color: $color-primary;
      transform: translateX(-50%) scaleX(1);
    }
  }
}

.header__link--home {
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

// SPはHOMEのみアイコン表示にするため、通常は非表示にしておく
.header__link-icon {
  display: none;
  transition: transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.header__link--home:hover .header__link-icon {
  transform: translateY(-1px) scale(1.08);
}

@media screen and (max-width: $bp-sm) {
  .header__inner {
    padding: 0 14px;
  }

  .header__brand {
    height: 40px;
    gap: 8px;
    padding: 0 14px;
  }

  .header__nav {
    height: 40px;
    gap: 14px;
    padding: 0 12px;
  }

  .header__logotype {
    font-size: 15px;
  }

  .header__link {
    font-size: 15px;
  }

  // SPはナビをHOMEのアイコンのみに絞る
  .header__link--about {
    display: none;
  }

  .header__link--home {
    padding-bottom: 2px;
  }

  .header__link-icon {
    display: block;
  }

  .header__link-text {
    display: none;
  }
}

// PCは本文＋サイドバーの2カラムになるので、その全幅までピルを広げる
@media screen and (min-width: $bp-lg) {
  .header__inner {
    max-width: $container-width;
  }
}
</style>
