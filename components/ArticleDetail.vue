<script lang="ts" setup>
import type { MicroCMSListContent } from 'microcms-js-sdk'
import type { Article } from '@/types'

const props = defineProps<{
  content: MicroCMSListContent & Article
}>()

const { formatDot } = useDate()
const { readingTime } = useArticleMeta()

const minutes = computed(() => readingTime(props.content.text))
</script>

<template>
  <div class="detail">
    <div class="detail__block">
      <div class="detail__breadcrumb">
        <slot name="breadcrumb">
          <NuxtLink to="/" class="detail__breadcrumb__link">← TOP</NuxtLink>
        </slot>
      </div>

      <div class="detail__visual">
        <img v-if="content.thumbnail?.url" class="detail__thumbnail" :src="content.thumbnail.url" :alt="content.title">
        <div v-else class="detail__thumbnail detail__thumbnail--placeholder" />
      </div>

      <h1 id="articleTitle" class="detail__title">{{ content.title }}</h1>
      <p class="detail__meta">
        {{ formatDot(content.createdAt) }}
        <span v-if="content.revisedAt"> ・ 更新 {{ formatDot(content.revisedAt) }}</span>
        <span v-if="minutes"> ・ 読了 {{ minutes }}分</span>
      </p>
      <TagLink v-if="content.tag" :tags="content.tag" class="detail__tags--top" />

      <div class="detail__text" v-html="content.text" />

      <TagLink v-if="content.tag" :tags="content.tag" class="detail__tags" />
    </div>

    <div class="detail__affiliate">
      <p class="detail__affiliate-label">関連商品リンク</p>
      <div v-html="content.affiliate" />
    </div>

    <slot name="after-affiliate" />

    <section v-if="content.related?.length" class="detail__related">
      <p class="detail__related-label">RELATED</p>
      <ArticleList :contents="content.related" variant="compact" />
    </section>
  </div>
</template>

<style lang="scss" scoped>
// 背景パターン（layouts/default.vue）の上に乗るブロック群。本文（見出し〜タグ）は
// 一連の読み物なのでひとつの不透明ブロックにまとめるが、関連商品リンクとRELATEDは
// 本文とは別のまとまりなので、このブロックからは分離し、余白でパターンを見せる
.detail {
  width: 100%;
}

.detail__block {
  @include content-card;
}

.detail__breadcrumb {
  padding-bottom: 14px;
}

.detail__breadcrumb__link {
  @include label($color-secondary);
  margin: 7px;
}

.detail__visual {
  position: relative;
  overflow: hidden;
  border-radius: $radius-image;
  margin-bottom: 24px;
}

.detail__thumbnail {
  display: block;
  width: 100%;
  aspect-ratio: 16 / 9;
  object-fit: cover;
}

.detail__thumbnail--placeholder {
  @include placeholder-stripe;
}

.detail__title {
  @include heading-1;

  margin-bottom: 12px;
}

.detail__meta {
  @include label($color-meta);

  margin: 0 0 16px;
}

.detail__tags--top {
  margin-bottom: 32px;
}

.detail__text {
  @include article-typography;
}

.detail__tags {
  margin-top: 32px;
}

.detail__affiliate {
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

.detail__affiliate-label {
  @include label($color-primary);

  font-weight: 700;
}

.detail__related {
  @include content-card(24px 28px, 20px 0);

  margin-top: 40px;
}

.detail__related-label {
  @include label($color-meta);

  margin: 0 0 14px;
}
</style>
