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
  @include label($color-secondary);

  padding: 3px 10px;
  border: 1px solid rgba($color-secondary, 0.4);
  border-radius: $radius-pill;
  background-color: rgba($color-secondary, 0.1);
  font-size: 12px;
  text-decoration: none;
  transition: background-color 0.2s ease, border-color 0.2s ease;

  &:hover {
    border-color: $color-secondary;
    background-color: rgba($color-secondary, 0.18);
  }
}
</style>
