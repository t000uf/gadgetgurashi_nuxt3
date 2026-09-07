<script lang="ts" setup>
import type { MicroCMSListContent } from 'microcms-js-sdk'
import type { Article } from '@/types'

const props = withDefaults(
  defineProps<{
    contents: (MicroCMSListContent & Article)[]
    /** grid: 通常の記事一覧 / compact: 関連記事のサムネイル一覧 */
    variant?: 'grid' | 'compact'
    /** 先頭の記事を「注目記事」として1カラムで大きく見せる */
    featured?: boolean
  }>(),
  { variant: 'grid', featured: false },
)

const featuredContent = computed(() =>
  props.featured && props.variant === 'grid' ? props.contents[0] : undefined,
)

const restContents = computed(() =>
  featuredContent.value ? props.contents.slice(1) : props.contents,
)
</script>

<template>
  <div class="article-list">
    <ArticleCard v-if="featuredContent" :key="featuredContent.id" :content="featuredContent" variant="featured"
      class="article-list__featured" />
    <div class="article-list__grid">
      <ArticleCard v-for="content in restContents" :key="content.id" :content="content"
        :variant="variant === 'compact' ? 'compact' : 'default'" />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.article-list {
  width: 100%;
  padding: 28px 14px;
}

.article-list__featured {
  margin-bottom: 28px;
}

.article-list__grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 28px $space-grid;
}

@media screen and (max-width: $bp-sm) {
  .article-list__grid {
    grid-template-columns: 1fr;
    gap: 22px;
  }
}
</style>
