<script lang="ts" setup>
import type { MicroCMSListContent } from 'microcms-js-sdk'
import type { Article } from '@/types'

const { formatDot } = useDate()

const route = useRoute()
const { data: content } = await useFetch<MicroCMSListContent & Article>(
  `/api/article/${route.params.id}`,
  { query: { depth: 2 } }
)

const { readingTime } = useArticleMeta()

const category = computed(() => content.value?.tag?.[0]?.tagName)
const minutes = computed(() => readingTime(content.value?.text))
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
  <article v-if="content" class="article">
    <p class="article__breadcrumb">TOP / {{ category ?? 'ARTICLE' }}</p>

    <div class="article__visual">
      <img
        v-if="content.thumbnail?.url"
        class="article__thumbnail"
        :src="content.thumbnail.url"
        :alt="content.title"
      >
      <div v-else class="article__thumbnail article__thumbnail--placeholder" />
      <span v-if="category" class="article__category">{{ category }}</span>
    </div>

    <h1 id="articleTitle" class="article__title">{{ content.title }}</h1>
    <p class="article__meta">
      {{ formatDot(content.createdAt) }}
      <span v-if="content.revisedAt"> ・ 更新 {{ formatDot(content.revisedAt) }}</span>
      <span v-if="minutes"> ・ 読了 {{ minutes }}分</span>
    </p>

    <div class="article__text" v-html="content.text" />

    <TagLink v-if="content.tag" :tags="content.tag" class="article__tags" />

    <div class="article__affiliate">
      <p class="article__affiliate-label">関連商品リンク</p>
      <div v-html="content.affiliate" />
    </div>

    <hr class="article__divider">

    <p class="article__share">
      <a :href="shareUrl" target="_blank" rel="noopener noreferrer">シェアする →</a>
    </p>

    <AdsByGoogle ad-slot="7173714878" />

    <section v-if="content.related?.length" class="article__related">
      <p class="article__related-label">RELATED</p>
      <ArticleList :contents="content.related" variant="compact" />
    </section>
  </article>
</template>

<style lang="scss" scoped>
// 背景パターン（layouts/default.vue）の上に乗るブロック。記事本文は一連の読み物
// なので、個別要素ごとではなく記事全体をひとつの不透明な塗りブロックとして扱う
.article {
  width: 100%;
  background-color: $color-bg;
  border-radius: $radius-card;
  padding: 28px;
}

@media screen and (max-width: $bp-sm) {
  .article {
    padding: 20px 16px;
  }
}

.article__breadcrumb {
  @include label($color-meta);

  margin: 0 0 14px;
}

.article__visual {
  position: relative;
  overflow: hidden;
  border-radius: $radius-image;
  margin-bottom: 24px;
}

.article__thumbnail {
  display: block;
  width: 100%;
  aspect-ratio: 16 / 9;
  object-fit: cover;
}

.article__thumbnail--placeholder {
  @include placeholder-stripe;
}

.article__category {
  @include badge;

  position: absolute;
  top: 12px;
  left: 12px;
}

.article__title {
  @include heading-1;

  margin-bottom: 12px;
}

.article__meta {
  @include label($color-meta);

  margin: 0 0 32px;
}

.article__text {
  @include article-typography;
}

.article__tags {
  margin-top: 32px;
}

.article__affiliate {
  @include card;

  max-width: 460px;
  margin: 32px auto;
  padding: 4px 20px 12px;
  border: 2px solid $color-primary;
  word-break: break-all;

  :deep(img) {
    width: 100%;
    height: auto;
    border-radius: $radius-image-sm;
  }
}

.article__affiliate-label {
  @include label($color-primary);

  font-weight: 700;
}

.article__divider {
  height: 2px;
  border: none;
  margin: 32px 0 18px;
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

.article__related {
  margin-top: 40px;
}

.article__related-label {
  @include label($color-meta);

  margin: 0 0 14px;
}
</style>
