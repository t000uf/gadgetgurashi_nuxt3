<script lang="ts" setup>
import type { Article } from '@/types/article'
import type { Tag } from '@/types/tag'
import type { MicroCMSListContent } from 'microcms-js-sdk'

const route = useRoute()
const tagId = route.params.tagId as string
const page = Number(route.params.p) || 1
const limit = 10

const [{ data: articleData }, { data: tagData }] = await Promise.all([
  useMicroCMSGetList<Article>({
    endpoint: 'article',
    queries: {
      fields: 'id,title,thumbnail,preview,tag',
      limit,
      filters: `tag[contains]${tagId}`,
      offset: (page - 1) * limit,
    }
  }),
  useMicroCMSGetList<Tag>({
    endpoint: 'tag',
    queries: { limit: 100 }
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
  <div class="sentence">
    <h3 id="allkiji">
      "{{ selectedTag?.tagName }}"の記事一覧
    </h3>
    <ArticleList v-if="articleData?.contents" :contents="articleData.contents" />
    <Pagination v-if="pager" :pager="pager" :current="page" :tag="selectedTag" />
  </div>
</template>

<style lang="scss" scoped>
.sentence {
  max-width: 700px;
  width: 100%;
  padding: 10px;
  box-sizing: border-box;
}
</style>
