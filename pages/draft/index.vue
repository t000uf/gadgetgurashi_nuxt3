<script lang="ts" setup>
import type { Article } from '@/types'
import type { MicroCMSListContent } from 'microcms-js-sdk'

const route = useRoute()

const content = ref<(MicroCMSListContent & Article) | null>(null)

onMounted(async () => {
  const { id, draftKey } = route.query
  if (!id || !draftKey) return

  content.value = await $fetch<MicroCMSListContent & Article>('/api/draft', {
    query: { id, draftKey }
  })
})

useHead({
  title: computed(() => `${content.value?.title} - がじぇっとぐらし！`),
  meta: computed(() => [
    { name: 'description', content: content.value?.preview },
    { property: 'og:type', content: 'blog' },
    { property: 'og:title', content: `${content.value?.title} - がじぇっとぐらし！` },
    { property: 'og:description', content: content.value?.preview },
    { property: 'og:url', content: `https://gadgetgurashi.com/article/${content.value?.id}` },
    { property: 'og:image', content: content.value?.thumbnail?.url },
    { name: 'twitter:card', content: 'summary_large_image' },
  ])
})
</script>

<template>
  <ArticleDetail v-if="content" :content="content" breadcrumb="DRAFT PREVIEW" />
</template>
