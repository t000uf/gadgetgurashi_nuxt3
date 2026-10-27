<script lang="ts" setup>
import type { Article, Tag, MicroCMSList } from '@/types'

const route = useRoute()
const tagId = route.params.tagId as string
const page = usePageNumber()
const limit = 10

const [{ data: articleData, error: articleError }, { data: tagData, error: tagError }] = await Promise.all([
  useFetch<MicroCMSList<Article>>('/api/article', {
    query: {
      fields: 'id,title,thumbnail,preview,tag,createdAt',
      limit,
      filters: `tag[contains]${tagId}`,
      offset: (page - 1) * limit,
    }
  }),
  // 一覧から探すと件数上限を超えたタグが見つからないので、IDで直接引く
  useFetch<MicroCMSList<Tag>>('/api/tag', {
    query: { ids: tagId, fields: 'id,tagName' }
  })
])

const selectedTag = computed(() => tagData.value?.contents[0])
throwIfNotFound(tagError, selectedTag)
// 記事0件のタグは1ページ目だけ表示し、範囲外のページは404にする
throwIfNotFound(articleError, computed(() => page === 1 || articleData.value?.contents.length))

const pager = computed(() =>
  [...Array(Math.ceil((articleData.value?.totalCount ?? 0) / limit)).keys()]
)
</script>

<template>
  <ArticleListPage
    breadcrumb="TAG"
    :title="`「${selectedTag?.tagName}」の記事`"
    :meta="`${articleData?.totalCount ?? 0} ARTICLES ・ PAGE ${page}`"
    :contents="articleData?.contents"
    :pager="pager"
    :current="page"
    :tag-id="tagId"
  />
</template>
