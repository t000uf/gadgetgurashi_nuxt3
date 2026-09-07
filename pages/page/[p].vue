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
    <p class="breadcrumb">TOP / ARCHIVE</p>
    <h1 id="allkiji" class="page-title">記事一覧</h1>
    <p class="page-meta">PAGE {{ page }}</p>
    <ArticleList v-if="data?.contents" :contents="data.contents" />
    <Pagination :pager="pager" :current="page" />
  </div>
</template>

<style lang="scss" scoped>
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

  margin: 0 0 24px;
}
</style>
