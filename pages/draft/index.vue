<script lang="ts" setup>
import type { Article } from '@/types'
import type { MicroCMSListContent } from 'microcms-js-sdk'

const route = useRoute()

const content = ref<(MicroCMSListContent & Article) | null>(null)
// 取得できなかった理由。URLの誤り（id・draftKeyの不足や不一致）とそれ以外（microCMSの障害など）で
// 案内を変える。障害なのにURLの確認を促すと、正しいURLを何度も確かめ直すことになる
const failure = ref<'invalid-url' | 'unavailable' | null>(null)

onMounted(async () => {
  const { id, draftKey } = route.query
  if (!id || !draftKey) {
    failure.value = 'invalid-url'
    return
  }

  try {
    content.value = await $fetch<MicroCMSListContent & Article>('/api/draft', {
      query: { id, draftKey }
    })
  } catch (error) {
    console.error('[draft] 下書きの取得に失敗しました', error)
    const statusCode = (error as { statusCode?: number }).statusCode
    failure.value = statusCode === 400 || statusCode === 404 ? 'invalid-url' : 'unavailable'
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
  <div v-else-if="failure" class="draft-error">
    <Breadcrumb current="DRAFT PREVIEW" />
    <p v-if="failure === 'invalid-url'" class="draft-error__text">
      下書きを取得できませんでした。URLの id と draftKey を確認してください。
    </p>
    <p v-else class="draft-error__text">
      下書きを一時的に取得できません。時間をおいて再読み込みしてください。
    </p>
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
