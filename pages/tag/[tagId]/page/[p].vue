<script lang="ts" setup>
import type { Article, Tag, MicroCMSList } from '@/types'

const route = useRoute()
const tagId = route.params.tagId
if (!isContentId(tagId)) {
  throw createNotFoundError()
}
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

// ids は複数指定を受けるので、念のため取得できたタグが要求したIDそのものかも確かめる
const selectedTag = computed(() => {
  const tag = tagData.value?.contents[0]
  return tag?.id === tagId ? tag : undefined
})
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
