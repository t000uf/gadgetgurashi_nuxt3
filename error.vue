<script lang="ts" setup>
defineProps<{
  error: {
    statusCode: number
    message: string
  }
}>()

useHead({
  title: 'ページが見つかりませんでした... - がじぇっとぐらし！'
})
</script>

<template>
  <div class="layout">
    <TheHeader />
    <main class="container">
      <div class="notfound">
        <p class="notfound__code">ERROR {{ error.statusCode }}</p>
        <h1 class="notfound__title">ページが見つかりませんでした...</h1>
        <p class="notfound__text">
          URLが変更されたか、記事が削除された可能性があります。
        </p>
        <p class="notfound__link">
          <NuxtLink to="/">ホームに戻る →</NuxtLink>
        </p>
      </div>
    </main>
    <TheFooter />
  </div>
</template>

<style lang="scss" scoped>
.layout {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: $color-bg;
}

.container {
  display: flex;
  justify-content: center;
  align-items: center;
  flex: 1;
  padding: ($header-height + 40px) 24px 64px;
}

.notfound {
  width: 100%;
  max-width: $content-width;
  text-align: center;
}

.notfound__code {
  @include label-mono(11px, $color-primary);

  margin: 0 0 16px;
  font-weight: 700;
  letter-spacing: 1.5px;
}

.notfound__title {
  margin: 0 0 16px;
  color: $color-base;
  font-family: $font-heading;
  font-weight: 700;
  font-size: 22px;
}

.notfound__text {
  margin: 0;
  color: $color-body;
  font-size: 14px;
}

.notfound__link {
  @include label-mono(12px, $color-secondary);

  margin-top: 24px;

  a {
    text-decoration: none;
  }
}
</style>
