<script lang="ts" setup>
import type { MicroCMSListContent } from 'microcms-js-sdk'
import type { Article, Tag } from '@/types'

defineProps<{
  breadcrumb: string
  title: string
  meta: string
  contents?: (MicroCMSListContent & Article)[]
  pager: number[]
  current: number
  tag?: MicroCMSListContent & Tag
}>()
</script>

<template>
  <div>
    <section class="page-heading">
      <p class="breadcrumb">{{ breadcrumb }}</p>
      <h1 class="page-title allkiji">{{ title }}</h1>
      <p class="page-meta">{{ meta }}</p>
    </section>
    <ArticleList v-if="contents" :contents="contents" />
    <Pagination :pager="pager" :current="current" :tag="tag" />
  </div>
</template>

<style lang="scss" scoped>
// 背景パターン（layouts/default.vue）の上に乗るブロック。トップページの
// section-heading（pages/index.vue）と同じ考え方で不透明に塗る
.page-heading {
  @include content-card(20px 28px, 16px 0);

  width: 100%;
  margin: 0 0 14px;
}

.breadcrumb {
  @include label($color-meta);

  margin: 0 0 14px;
}

.page-title {
  @include heading-1;

  margin-bottom: 12px;
}

.page-meta {
  @include label($color-meta);

  margin: 0;
}
</style>
