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
  <div>
    <p class="breadcrumb">TOP / TAG</p>
    <h1 class="page-title allkiji">「{{ selectedTag?.tagName }}」の記事</h1>
    <p class="page-meta">{{ articleData?.totalCount ?? 0 }} ARTICLES ・ PAGE {{ page }}</p>
    <ArticleList v-if="articleData?.contents" :contents="articleData.contents" />
    <Pagination v-if="pager" :pager="pager" :current="page" :tag="selectedTag" />
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
