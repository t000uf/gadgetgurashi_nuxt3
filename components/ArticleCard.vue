<script lang="ts" setup>
import type { MicroCMSListContent } from 'microcms-js-sdk'
import type { Article } from '@/types'

const props = withDefaults(
  defineProps<{
    content: MicroCMSListContent & Article
    /** featured: 注目記事（1カラム大） / default: グリッド / compact: 関連記事の横並び */
    variant?: 'featured' | 'default' | 'compact'
  }>(),
  { variant: 'default' },
)

const { formatDot } = useDate()

const date = computed(() => formatDot(props.content.createdAt))
const category = computed(() => props.content.tag?.[0]?.tagName)
</script>

<template>
  <NuxtLink :to="`/article/${content.id}/`" class="card" :class="`card--${variant}`">
    <div class="card__visual">
      <img
        v-if="content.thumbnail?.url"
        class="card__image"
        :src="content.thumbnail.url"
        :alt="content.title"
        loading="lazy"
      >
      <div v-else class="card__image card__image--placeholder" />
      <span v-if="variant === 'featured'" class="card__badge card__badge--featured">注目</span>
      <span v-else-if="variant === 'default' && category" class="card__badge">{{ category }}</span>
    </div>
    <div class="card__body">
      <h3 class="card__title">{{ content.title }}</h3>
      <p v-if="variant === 'featured' && content.preview" class="card__preview">
        {{ content.preview }}...
      </p>
      <time v-if="date && variant !== 'compact'" class="card__date">{{ date }}</time>
    </div>
  </NuxtLink>
</template>

<style lang="scss" scoped>
.card {
  display: block;
  color: inherit;
  text-decoration: none;

  &:hover {
    color: inherit;

    .card__image {
      transform: scale(1.03);
    }

    .card__title {
      color: $color-primary;
    }
  }
}

.card__visual {
  position: relative;
  overflow: hidden;
  border-radius: $radius-image-sm;
}

.card__image {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.4s ease;
}

.card__image--placeholder {
  @include placeholder-stripe(8px);
}

.card__badge {
  @include badge;

  position: absolute;
  top: 8px;
  left: 8px;
  max-width: calc(100% - 16px);
  font-size: 10px;
}

.card__badge--featured {
  background-color: $color-primary;
}

.card__title {
  margin: 0;
  color: $color-base;
  font-family: $font-heading;
  font-weight: 700;
  line-height: 1.5;
  transition: color 0.2s ease;
}

.card__date {
  @include label-mono(11px, $color-meta);

  display: inline-block;
  margin-top: 6px;
}

// --- featured：1カラムの大きなカード -------------------------
.card--featured {
  .card__visual {
    border-radius: $radius-image;
  }

  .card__image {
    aspect-ratio: 16 / 9;
  }

  .card__badge {
    top: 12px;
    left: 12px;
    font-size: 11px;
  }

  .card__body {
    padding-top: 12px;
  }

  .card__title {
    font-size: 20px;
  }
}

.card__preview {
  margin: 8px 0 0;
  color: $color-body;
  font-size: 14px;
  line-height: 1.8;
}

// --- default：2カラムグリッド --------------------------------
.card--default {
  .card__image {
    aspect-ratio: 16 / 10;
  }

  .card__body {
    padding-top: 10px;
  }

  .card__title {
    font-size: 15px;
  }
}

// --- compact：関連記事の横並びサムネイル ---------------------
.card--compact {
  display: flex;
  align-items: center;
  gap: 10px;

  .card__visual {
    flex: none;
    width: 56px;
    height: 56px;
    border-radius: $radius-image-sm;
  }

  .card__title {
    font-size: 13px;
  }
}

@media screen and (max-width: $bp-sm) {
  .card--featured .card__title {
    font-size: 17px;
  }
}
</style>
