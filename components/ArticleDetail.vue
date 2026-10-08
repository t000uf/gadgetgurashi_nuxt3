<script lang="ts" setup>
import type { MicroCMSListContent } from 'microcms-js-sdk'
import type { Article, AmazonProduct } from '@/types'

const props = defineProps<{
  content: MicroCMSListContent & Article
  breadcrumb?: string
}>()

const { formatDot } = useDate()
const { readingTime } = useArticleMeta()
const { thumbnailUrl } = useThumbnail()

const minutes = computed(() => readingTime(props.content.text))
const thumbnail = computed(() => thumbnailUrl(props.content.thumbnail?.url, 1200))

const { splitShortcodes, findProduct } = useAmazon()

// 本文を {{amazon:ASIN}} の位置で分割する。未登録ASINのカードは出さない
type RenderSegment =
  | { type: 'html'; html: string }
  | { type: 'product'; product: AmazonProduct }

const segments = computed(() =>
  splitShortcodes(props.content.text).flatMap((segment): RenderSegment[] => {
    if (segment.type === 'html') return [segment]
    const product = findProduct(props.content.products, segment.asin)
    return product ? [{ type: 'product', product }] : []
  }),
)

const bodyRef = ref<HTMLElement>()

useToc(
  computed(() => props.content.title),
  computed(() => props.content.text),
  bodyRef,
)
</script>

<template>
  <div class="detail">
    <div class="detail__block">
      <Breadcrumb :current="breadcrumb" />

      <div class="detail__visual">
        <img v-if="thumbnail" class="detail__thumbnail" :src="thumbnail" :alt="content.title">
        <div v-else class="detail__thumbnail detail__thumbnail--placeholder" />
      </div>

      <h1 id="articleTitle" class="detail__title">{{ content.title }}</h1>
      <p class="detail__meta">
        {{ formatDot(content.createdAt) }}
        <span v-if="content.revisedAt"> ・ 更新 {{ formatDot(content.revisedAt) }}</span>
        <span v-if="minutes"> ・ 読了 {{ minutes }}分</span>
      </p>
      <TagLink v-if="content.tag" :tags="content.tag" class="detail__tags--top" />

      <div ref="bodyRef">
        <template v-for="(segment, i) in segments" :key="i">
          <div v-if="segment.type === 'html'" class="detail__text" v-html="segment.html" />
          <AmazonCard v-else :product="segment.product" class="detail__product" />
        </template>
      </div>

      <TagLink v-if="content.tag" :tags="content.tag" class="detail__tags" />
    </div>

    <div v-if="content.products?.length || content.affiliate" class="detail__affiliate">
      <p class="detail__affiliate-label">関連商品リンク</p>
      <template v-if="content.products?.length">
        <AmazonCard
          v-for="product in content.products"
          :key="product.asin"
          :product="product"
          class="detail__affiliate-item" />
      </template>
      <div v-else class="detail__affiliate-legacy" v-html="content.affiliate" />
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
  scroll-margin-top: $header-height + 16px;
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

.detail__product {
  margin: 8px 0 1.6em;
}

.detail__tags {
  margin-top: 32px;
}

// RELATEDと同じ箱（content-card）に載せ、コンテンツ幅とラベルの見た目を揃える
.detail__affiliate {
  @include content-card(24px 28px, 20px 16px);

  margin-top: 40px;
}

.detail__affiliate-item {
  margin: 0 0 12px;

  &:last-child {
    margin-bottom: 0;
  }
}

.detail__affiliate-label {
  @include label($color-meta);

  margin: 0 0 14px;
}

.detail__affiliate-legacy {
  @include card;

  padding: 4px 20px 12px;
  border: 2px solid $color-primary;
  word-break: break-all;

  :deep(img) {
    width: 100%;
    height: auto;
    border-radius: $radius-image-sm;
  }
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
