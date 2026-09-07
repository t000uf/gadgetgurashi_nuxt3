<script lang="ts" setup>
const route = useRoute()

const isHome = computed(() => route.path === '/' || route.path.startsWith('/page/'))
const isAbout = computed(() => route.path.startsWith('/article/about'))
</script>

<template>
  <header class="header">
    <div class="header__inner">
      <NuxtLink to="/" class="header__brand">
        <BrandLogo :size="24" />
        <span class="header__logotype">がじぇっとぐらし！</span>
      </NuxtLink>
      <nav class="header__nav">
        <NuxtLink to="/" class="header__link" :class="{ 'is-active': isHome }">HOME</NuxtLink>
        <NuxtLink
          to="/article/about"
          class="header__link"
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
  border-bottom: 1px solid $color-header-border;
  background-color: $color-header-bg;
}

.header__inner {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  max-width: $container-width;
  padding: 0 24px;
}

.header__brand {
  display: flex;
  align-items: center;
  gap: 9px;
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
  font-size: 16px;
  line-height: 1;
}

.header__nav {
  display: flex;
  gap: 20px;
}

.header__link {
  position: relative;
  padding-bottom: 4px;
  color: $color-nav-inactive;
  font-family: $font-heading;
  font-weight: 500;
  font-size: 15px;
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

@media screen and (max-width: $bp-sm) {
  .header__inner {
    padding: 0 16px;
  }

  .header__logotype {
    font-size: 14px;
  }
}
</style>
