<script lang="ts" setup>
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
      </nav>
    </div>
    <small class="footer__copyright">© {{ year }} gadgetgurashi</small>
  </footer>
</template>

<style lang="scss" scoped>
// フッター本体は透明のまま。ロゴ・ナビ・著作権表記はそれぞれ独立したピルとして塗る
// （ヘッダーと同じ考え方・同じ$color-header-bg。パターンを隠すのが目的）
.footer {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 18px;
  padding: 32px 24px 28px;
  background: transparent;
}

// ヘッダーと同じ考え方。1カラムのSP/タブレットでは本文と同じ幅に収める
.footer__inner {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 20px;
  width: 100%;
  max-width: $content-width;
}

.footer__brand {
  @include content-block($color-header-bg, $opacity-header);

  display: flex;
  align-items: center;
  height: 36px;
  gap: 9px;
  padding: 0 16px;
  border-radius: $radius-pill;
  color: $color-base;
}

.footer__logotype {
  font-family: $font-heading;
  font-weight: 700;
  font-size: 14px;
}

.footer__nav {
  @include content-block($color-header-bg, $opacity-header);

  display: flex;
  align-items: center;
  height: 36px;
  gap: 20px;
  padding: 0 20px;
  border-radius: $radius-pill;
}

.footer__link {
  padding: 0;
  border: none;
  background: none;
  color: $color-nav-inactive;
  font-family: $font-heading;
  font-weight: 500;
  font-size: 15px;
  text-decoration: none;
  cursor: pointer;
  transition: color 0.2s ease;

  &:hover {
    color: $color-primary;
  }
}

.footer__copyright {
  @include label($color-meta);
  @include content-block($color-header-bg, $opacity-header);

  border-radius: $radius-pill;
  padding: 6px 16px;
  font-size: 13px;
}

@media screen and (max-width: $bp-sm) {
  .footer__inner {
    flex-direction: column;
    gap: 16px;
  }
}

@media screen and (min-width: $bp-lg) {
  .footer__inner {
    max-width: $container-width;
  }
}
</style>
