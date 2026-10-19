<script lang="ts" setup>
import type { Article } from '@/types'
import type { MicroCMSListContent } from 'microcms-js-sdk'

const route = useRoute()

const content = ref<(MicroCMSListContent & Article) | null>(null)
const failed = ref(false)

onMounted(async () => {
  const { id, draftKey } = route.query
  if (!id || !draftKey) {
    failed.value = true
    return
  }

  try {
    content.value = await $fetch<MicroCMSListContent & Article>('/api/draft', {
      query: { id, draftKey }
    })
  } catch (error) {
    console.error('[draft] 下書きの取得に失敗しました', error)
    failed.value = true
  }
})

useHead({
  title: computed(() => `${content.value?.title ?? '下書きプレビュー'} - がじぇっとぐらし！`),
  // 未公開の下書きなので検索エンジンに載せない（サイトマップ除外だけでは防げない）
  meta: [{ name: 'robots', content: 'noindex, nofollow' }],
})
</script>

<template>
  <ArticleDetail v-if="content" :content="content" breadcrumb="DRAFT PREVIEW" />
  <div v-else-if="failed" class="draft-error">
    <Breadcrumb current="DRAFT PREVIEW" />
    <p class="draft-error__text">下書きを取得できませんでした。URLの id と draftKey を確認してください。</p>
  </div>
</template>

<style lang="scss" scoped>
.draft-error {
  @include content-card(28px, 20px 0);

  width: 100%;
}

.draft-error__text {
  margin: 0;
  color: $color-body;
}
</style>
