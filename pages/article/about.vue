<script lang="ts" setup>
import type { MicroCMSListContent } from 'microcms-js-sdk'
import type { About } from '@/types'

const { formatDot } = useDate()

const { data: content } = await useFetch<MicroCMSListContent & About>('/api/about/about')

useHead({
  title: computed(() => `${content.value?.title} - がじぇっとぐらし！`),
})
</script>

<template>
  <div class="about">
    <p class="about__breadcrumb">TOP / ABOUT</p>
    <template v-if="content">
      <h1 class="about__title">{{ content.title }}</h1>
      <p class="about__meta">更新 {{ formatDot(content.revisedAt) }}</p>
      <div class="about__text" v-html="content.text" />
    </template>
    <AdsByGoogle ad-slot="7173714878" />
  </div>
</template>

<style lang="scss" scoped>
// 背景パターン（layouts/default.vue）の上に乗るブロック。記事詳細ページと同様、
// ページ全体をひとつの不透明な塗りブロックとして扱う
.about {
  @include content-card(28px, 20px 0);

  width: 100%;
}

.about__breadcrumb {
  @include label($color-meta);

  margin: 0 0 14px;
}

.about__title {
  @include heading-1;

  margin-bottom: 12px;
}

.about__meta {
  @include label($color-meta);

  margin: 0 0 32px;
}

.about__text {
  @include article-typography;
}
</style>
