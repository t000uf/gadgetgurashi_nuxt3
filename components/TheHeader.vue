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

.header__inner {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  max-width: $container-width;
  padding: 0 24px;
}

// 背景パターンの上に乗るため、ロゴタイプとナビゲーションはそれぞれ独立した
// 半透明+backdrop-filterのピルとして塗る（ヘッダー全体は透明のまま）
.header__brand {
  @include content-block($color-header-bg);

  display: flex;
  align-items: center;
  height: 44px;
  gap: 10px;
  padding: 0 20px;
  border-radius: $radius-pill;
  color: $color-base;
  text-decoration: none;

  &:hover {
    color: $color-base;
    opacity: 0.8;
  }
}

.header__logotype {
  font-family: $font-heading;
  font-weight: 700;
  font-size: 17px;
  line-height: 1;
}

.header__nav {
  @include content-block($color-header-bg);

  display: flex;
  align-items: center;
  height: 44px;
  gap: 24px;
  padding: 0 24px;
  border-radius: $radius-pill;
}

.header__link {
  position: relative;
  padding-bottom: 4px;
  color: $color-nav-inactive;
  font-family: $font-heading;
  font-weight: 500;
  font-size: 16px;
  text-decoration: none;
  transition: color 0.2s ease;

  &:hover {
    color: $color-base;
  }

  &.is-active {
    color: $color-primary;
    font-weight: 700;

    &::after {
      position: absolute;
      bottom: 0;
      left: 0;
      display: block;
      width: 100%;
      height: 2px;
      border-radius: $radius-bar;
      background-color: $color-primary;
      content: '';
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
</style>
