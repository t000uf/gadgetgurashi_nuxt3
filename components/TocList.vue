<script lang="ts" setup>
import type { TocItem } from '@/composables/useToc'
import { activeTocIds } from '@/composables/useToc'

const props = defineProps<{
  toc: TocItem[]
  activeId: string
}>()

const emit = defineEmits<{ select: [] }>()

const activeIds = computed(() => activeTocIds(props.toc, props.activeId))
</script>

<template>
  <ul class="toc-list">
    <li v-for="item in toc" :key="item.id">
      <a :href="`#${item.id}`" class="toc-list__link"
        :class="[`toc-list__link--${item.level}`, { 'is-active': activeIds.has(item.id) }]" @click="emit('select')">
        <span class="toc-list__marker" />
        <span>{{ item.text }}</span>
      </a>
    </li>
  </ul>
</template>

<style lang="scss" scoped>
.toc-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin: 0;
  padding: 0;
  list-style: none;
}

// 実コンテンツの大見出しはH3なので、H2/H3は同じ階層として扱う。
// マーカーは見出しシステム（heading-2 / heading-4）と同じドットの手触りに揃える
.toc-list__link {
  display: flex;
  align-items: center;
  gap: 8px;
  color: $color-base;
  font-family: $font-heading;
  font-weight: 700;
  font-size: 13px;
  line-height: 1.5;
  text-decoration: none;
  transition: color 0.2s ease;

  &:hover {
    color: $color-primary;
  }

  &.is-active {
    color: $color-primary;
  }
}

.toc-list__marker {
  flex: none;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: $color-primary;
}

// H4だけ一段下げ、マーカーは角形・色はアクセントのブルーで区別する
.toc-list__link--h4 {
  margin-left: 14px;
  color: $color-body;
  font-weight: 500;
  font-size: 12px;

  .toc-list__marker {
    width: 6px;
    height: 6px;
    border-radius: 0;
    background-color: $color-secondary;
  }
}
</style>
