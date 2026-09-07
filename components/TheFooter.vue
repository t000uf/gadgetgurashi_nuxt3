<script lang="ts" setup>
const { returnTop } = useScrollTop()
const year = new Date().getFullYear()
</script>

<template>
  <footer class="footer">
    <div class="footer__inner">
      <div class="footer__brand">
        <BrandLogo :size="22" />
        <span class="footer__logotype">がじぇっとぐらし！</span>
      </div>
      <nav class="footer__nav">
        <NuxtLink to="/" class="footer__link">HOME</NuxtLink>
        <NuxtLink to="/article/about" class="footer__link">ABOUT</NuxtLink>
        <button type="button" class="footer__link footer__pagetop" @click="returnTop">
          PAGE TOP ↑
        </button>
      </nav>
    </div>
    <small class="footer__copyright">© {{ year }} gadgetgurashi</small>
  </footer>
</template>

<style lang="scss" scoped>
.footer {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 18px;
  padding: 32px 24px 28px;
  border-top: 1px solid $color-border;
  background-color: $color-header-bg;
}

.footer__inner {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 20px;
  width: 100%;
  max-width: $container-width;
}

.footer__brand {
  display: flex;
  align-items: center;
  gap: 9px;
  color: $color-base;
}

.footer__logotype {
  font-family: $font-heading;
  font-weight: 700;
  font-size: 14px;
}

.footer__nav {
  display: flex;
  align-items: center;
  gap: 20px;
}

.footer__link {
  @include label-mono(10px, $color-nav-inactive);

  padding: 0;
  border: none;
  background: none;
  text-decoration: none;
  cursor: pointer;
  transition: color 0.2s ease;

  &:hover {
    color: $color-primary;
  }
}

.footer__copyright {
  @include label-mono(9px, $color-meta);
}

@media screen and (max-width: $bp-sm) {
  .footer__inner {
    flex-direction: column;
    gap: 16px;
  }
}
</style>
