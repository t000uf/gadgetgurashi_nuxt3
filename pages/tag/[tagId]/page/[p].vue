<script lang="ts" setup>
import type { Article, Tag, MicroCMSList } from '@/types'

const route = useRoute()
const tagId = route.params.tagId as string
const page = Number(route.params.p) || 1
const limit = 10

const [{ data: articleData }, { data: tagData }] = await Promise.all([
  useFetch<MicroCMSList<Article>>('/api/article', {
    query: {
      fields: 'id,title,thumbnail,preview,tag,createdAt',
      limit,
      filters: `tag[contains]${tagId}`,
      offset: (page - 1) * limit,
    }
  }),
  useFetch<MicroCMSList<Tag>>('/api/tag', {
    query: { limit: 100 }
  })
])

const selectedTag = computed(() =>
  tagData.value?.contents.find((tag) => tag.id === tagId)
)

const pager = computed(() =>
  [...Array(Math.ceil((articleData.value?.totalCount ?? 0) / limit)).keys()]
)
</script>

<template>
  <ArticleListPage
    breadcrumb="TOP / TAG"
    :title="`「${selectedTag?.tagName}」の記事`"
    :meta="`${articleData?.totalCount ?? 0} ARTICLES ・ PAGE ${page}`"
    :contents="articleData?.contents"
    :pager="pager"
    :current="page"
    :tag="selectedTag"
  />
</template>
