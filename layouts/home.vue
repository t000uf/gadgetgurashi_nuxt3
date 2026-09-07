<script lang="ts" setup></script>

<template>
  <div class="layout">
    <BackgroundPattern />
    <TheHeader />
    <main class="container">
      <div class="hero">
        <img src="@/assets/imgs/DSCF1982.jpg" alt="" class="hero__image">
      </div>
      <div class="contents">
        <div class="contents__main">
          <slot />
        </div>
        <SideBar />
      </div>
    </main>
    <NavButton />
    <TheFooter />
  </div>
</template>

<style lang="scss" scoped>
.layout {
  position: relative;
  z-index: 0; // スタッキングコンテキストを作り、子のz-index:-1(背景パターン)をこの中に閉じ込める
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: $color-bg;
}

.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1;
  width: 100%;
  padding: ($header-height + 24px) 24px 64px;
}

.hero {
  width: 100%;
  max-width: $content-width;
  overflow: hidden;
  border-radius: $radius-image;
}

.hero__image {
  display: block;
  width: 100%;
  height: clamp(180px, 32vw, 360px);
  object-fit: cover;
  object-position: 50% 50%;
}

.contents {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 40px;
  width: 100%;
  max-width: $container-width;
  margin-top: 32px;
  opacity: 0;
  animation: fadein 0.5s ease-out 0.1s forwards;
}

.contents__main {
  width: 100%;
  max-width: $content-width;
  min-width: 0;
}

@media screen and (max-width: $bp-sm) {
  .container {
    padding: ($header-height + 16px) 16px 48px;
  }
}

@media screen and (min-width: $bp-lg) {
  .contents {
    flex-direction: row;
    align-items: flex-start;
    justify-content: center;
  }

  // PCはsidenavとの2カラムになるため、ヒーローは記事一覧＋サイドバーを合わせた
  // container-width まで伸ばす（SP/タブレットは記事一覧と同じcontent-widthのまま）
  .hero {
    max-width: $container-width;
  }
}
</style>
