<script lang="ts" setup>
import type { MicroCMSListContent } from 'microcms-js-sdk'
import type { Article } from '@/types'

const route = useRoute()
const { data: content } = await useFetch<MicroCMSListContent & Article>(
  `/api/article/${route.params.id}`,
  { query: { depth: 2 } }
)

const shareUrl = computed(() => {
  const url = `https://gadgetgurashi.com/article/${content.value?.id}/`
  const text = `${content.value?.title ?? ''} - がじぇっとぐらし！`
  return `https://x.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`
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
  <ArticleDetail v-if="content" :content="content">
    <template #after-affiliate>
      <div class="article__tail">
        <hr class="article__divider">

        <p class="article__share">
          <a :href="shareUrl" target="_blank" rel="noopener noreferrer">シェアする →</a>
        </p>

        <AdsByGoogle ad-slot="7173714878" />
      </div>
    </template>
  </ArticleDetail>
</template>

<style lang="scss" scoped>
.article__tail {
  @include content-card;
}

.article__divider {
  height: 2px;
  border: none;
  margin: 0 0 18px;
  background-color: $color-placeholder-1;
}

.article__share {
  @include label($color-secondary);

  margin: 0 0 32px;
  text-align: right;

  a {
    text-decoration: none;
  }
}
</style>
