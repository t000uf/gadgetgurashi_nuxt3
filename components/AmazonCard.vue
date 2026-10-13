<script lang="ts" setup>
import type { AmazonProduct } from '@/types/article'

const props = defineProps<{
  product: AmazonProduct
}>()

const { buildAmazonUrl } = useAmazon()
const { thumbnailUrl } = useThumbnail()

const href = computed(() => buildAmazonUrl(props.product.asin))
const image = computed(() => thumbnailUrl(props.product.image?.url, 320))
</script>

<template>
  <a class="amazon-card" :href="href" target="_blank" rel="sponsored nofollow noopener">
    <img v-if="image" class="amazon-card__image" :src="image" :alt="product.title" loading="lazy">
    <span v-else class="amazon-card__image amazon-card__image--placeholder" />
    <span class="amazon-card__body">
      <span class="amazon-card__title">{{ product.title }}</span>
      <span class="amazon-card__cta">Amazonで見る</span>
    </span>
  </a>
</template>

<style lang="scss" scoped>
.amazon-card {
  @include card;

  display: flex;
  align-items: center;
  gap: 16px;
  padding: 12px;
  border: 2px solid $color-primary;
  color: $color-body;
  text-decoration: none;

  &:hover {
    border-color: $color-primary-dark;
  }
}

.amazon-card__image {
  flex: none;
  width: 96px;
  aspect-ratio: 1;
  object-fit: contain;
  border-radius: $radius-image-sm;
}

.amazon-card__image--placeholder {
  @include placeholder-stripe;
}

.amazon-card__body {
  display: flex;
  flex-direction: column;
  gap: 8px;
  min-width: 0;
}

.amazon-card__title {
  font-family: $font-body;
  font-size: 15px;
  font-weight: 700;
  line-height: 1.6;
  word-break: break-word;
}

.amazon-card__cta {
  @include label($color-primary);

  font-weight: 700;
}
</style>
