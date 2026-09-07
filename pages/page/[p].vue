<script lang="ts" setup>
import type { Article, MicroCMSList } from '@/types'

definePageMeta({
  layout: 'default'
})

const route = useRoute()
const page = Number(route.params.p) || 1
const limit = 10

const { data } = await useFetch<MicroCMSList<Article>>('/api/article', {
  query: {
    limit,
    offset: (page - 1) * limit,
  }
})

const pager = computed(() =>
  [...Array(Math.ceil((data.value?.totalCount ?? 0) / limit)).keys()]
)
</script>

<template>
  <div>
    <section class="page-heading">
      <p class="breadcrumb">TOP / ARCHIVE</p>
      <h1 class="page-title allkiji">記事一覧</h1>
      <p class="page-meta">PAGE {{ page }}</p>
    </section>
    <ArticleList v-if="data?.contents" :contents="data.contents" />
    <Pagination :pager="pager" :current="page" />
  </div>
</template>

<style lang="scss" scoped>
// 背景パターン（layouts/default.vue）の上に乗るブロック。トップページの
// section-heading（pages/index.vue）と同じ考え方で不透明に塗る
.page-heading {
  @include content-block;

  width: 100%;
  margin: 0 0 14px;
  border-radius: $radius-card;
  padding: 20px 28px;
}

@media screen and (max-width: $bp-sm) {
  .page-heading {
    padding: 16px 0;
  }
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
