<script lang="ts" setup>
import type { Article } from '@/types'

definePageMeta({
  layout: 'default'
})

const route = useRoute()
const page = Number(route.params.p) || 1
const limit = 10

const { data } = await useMicroCMSGetList<Article>({
  endpoint: 'article',
  queries: {
    limit,
    offset: (page - 1) * limit,
  }
})

const pager = computed(() =>
  [...Array(Math.ceil((data.value?.totalCount ?? 0) / limit)).keys()]
)
</script>

<template>
  <div class="sentence_home">
    <h3 id="allkiji">
      記事一覧 {{ page }}ページ目
    </h3>
    <ArticleList v-if="data?.contents" :contents="data.contents" />
    <Pagination :pager="pager" :current="page" />
  </div>
</template>
