<script lang="ts" setup>
const props = defineProps<{
  error: {
    statusCode: number
    message: string
  }
}>()

// 404以外（microCMSの障害など）で「削除された可能性」と出すと原因を取り違えるので文言を分ける
const notFound = computed(() => props.error.statusCode === 404)
const title = computed(() =>
  notFound.value ? 'ページが見つかりませんでした...' : 'ページを表示できませんでした...'
)

useHead({
  title: computed(() => `${title.value} - がじぇっとぐらし！`)
})
</script>

<template>
  <div class="layout">
    <TheHeader />
    <main class="container">
      <div class="notfound">
        <p class="notfound__code">ERROR {{ error.statusCode }}</p>
        <h1 class="notfound__title">{{ title }}</h1>
        <p class="notfound__text">
          <template v-if="notFound">URLが変更されたか、記事が削除された可能性があります。</template>
          <template v-else>一時的な問題が発生しています。時間をおいて再度お試しください。</template>
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
  @include label($color-primary);

  margin: 0 0 16px;
  font-weight: 700;
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
  @include label($color-secondary);

  margin-top: 24px;

  a {
    text-decoration: none;
  }
}
</style>
