<script lang="ts" setup>
import type { MicroCMSListContent } from 'microcms-js-sdk'
import type { Article } from '@/types'

const route = useRoute()
const { data: content, error } = await useFetch<MicroCMSListContent & Article>(
  `/api/article/${route.params.id}`,
  { query: { depth: 2 } }
)
throwIfNotFound(error, content)

// og:url・JSON-LD・サイトマップと同じく末尾スラッシュなしに揃える（canonicalを分裂させない）
const shareUrl = computed(() => `https://gadgetgurashi.com/article/${content.value?.id}`)
const shareTitle = computed(() => `${content.value?.title ?? ''} - がじぇっとぐらし！`)

const articleShare = useArticleShare()
watchEffect(() => {
  articleShare.value = content.value ? { url: shareUrl.value, title: shareTitle.value } : null
})
// 記事→記事の遷移では次のページのsetupが先に走るので、自分が書いた値のときだけ消す
onUnmounted(() => {
  if (articleShare.value?.url === shareUrl.value) articleShare.value = null
})

const toJsonLd = (value: unknown) => JSON.stringify(value).replace(/</g, '\\u003c')

useHead({
  title: shareTitle,
  meta: computed(() => [
    { name: 'description', content: content.value?.preview },
    { property: 'og:type', content: 'blog' },
    { property: 'og:title', content: shareTitle.value },
    { property: 'og:description', content: content.value?.preview },
    { property: 'og:url', content: shareUrl.value },
    { property: 'og:image', content: content.value?.thumbnail?.url },
    { name: 'twitter:card', content: 'summary_large_image' },
  ]),
  script: computed(() => {
    if (!content.value) return []

    const articleUrl = `https://gadgetgurashi.com/article/${content.value.id}`

    return [
      {
        type: 'application/ld+json',
        innerHTML: toJsonLd({
          '@context': 'https://schema.org',
          '@type': 'Article',
          headline: content.value.title,
          image: content.value.thumbnail?.url ? [content.value.thumbnail.url] : undefined,
          datePublished: content.value.createdAt,
          dateModified: content.value.revisedAt ?? content.value.createdAt,
          author: { '@type': 'Organization', name: 'がじぇっとぐらし！' },
          publisher: { '@type': 'Organization', name: 'がじぇっとぐらし！' },
          mainEntityOfPage: { '@type': 'WebPage', '@id': articleUrl },
        }),
      },
      {
        type: 'application/ld+json',
        innerHTML: toJsonLd({
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'TOP', item: 'https://gadgetgurashi.com' },
            { '@type': 'ListItem', position: 2, name: content.value.title, item: articleUrl },
          ],
        }),
      },
    ]
  }),
})
</script>

<template>
  <ArticleDetail v-if="content" :content="content">
    <template #after-affiliate>
      <hr class="article__divider">

      <div class="article__tail">
        <div class="article__share">
          <ShareButtons :url="shareUrl" :title="shareTitle" />
        </div>

        <AdsByGoogle ad-slot="7173714878" />
      </div>
    </template>
  </ArticleDetail>
</template>

<style lang="scss" scoped>
.article__divider {
  height: 2px;
  border: none;
  margin: 0 0 24px;
  background-color: $color-placeholder-1;
}

// SHAREのラベルをRELATED（content-cardの28px）の左端に揃える。
// ShareButtons自身が8pxのパディングを持つため、その分を差し引く
.article__tail {
  padding: 0 20px;

  @media screen and (max-width: $bp-sm) {
    padding: 0;
  }
}

.article__share {
  display: flex;
  justify-content: flex-start;
  margin: 0 0 32px;

  // SPは本文・RELATEDの余白が0になるので、ShareButtonsの8pxを打ち消して左端を揃える
  @media screen and (max-width: $bp-sm) {
    margin-left: -8px;
  }
}
</style>
