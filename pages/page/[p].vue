<script lang="ts" setup>
import type { Article, MicroCMSList } from '@/types'

definePageMeta({
  layout: 'default'
})

const page = usePageNumber()
const limit = 10

const { data, error } = await useFetch<MicroCMSList<Article>>('/api/article', {
  query: {
    limit,
    offset: (page - 1) * limit,
  }
})
throwIfNotFound(error, computed(() => data.value?.contents.length))

const pager = computed(() =>
  [...Array(Math.ceil((data.value?.totalCount ?? 0) / limit)).keys()]
)
</script>

<template>
  <ArticleListPage
    breadcrumb="ARCHIVE"
    title="記事一覧"
    :meta="`PAGE ${page}`"
    :contents="data?.contents"
    :pager="pager"
    :current="page"
  />
</template>
