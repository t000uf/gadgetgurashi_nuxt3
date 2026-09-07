<script lang="ts" setup>
import type { MicroCMSListContent } from 'microcms-js-sdk'
import type { Tag } from '@/types'

defineProps<{
  tags: (MicroCMSListContent & Tag)[]
}>()
</script>

<template>
  <div class="tags">
    <NuxtLink v-for="tag in tags" :key="tag.id" :to="`/tag/${tag.id}/page/1/`" class="tags__item">
      {{ tag.tagName }}
    </NuxtLink>
  </div>
</template>

<style lang="scss" scoped>
.tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.tags__item {
  @include badge;

  text-decoration: none;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: $color-secondary-dark;
    color: #fff;
  }
}
</style>
