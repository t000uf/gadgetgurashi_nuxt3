<script lang="ts" setup>
import type { MicroCMSListContent } from 'microcms-js-sdk'
import type { Tag } from '@/types'

const props = defineProps<{
  pager: number[]
  current: number
  tag?: MicroCMSListContent & Tag
}>()

const getPath = (p: number) => {
  return `/${props.tag ? `tag/${props.tag.id}/` : ''}page/${p}/`
}
</script>

<template>
  <nav class="pagination" aria-label="ページ送り">
    <div class="pagination__inner">
      <NuxtLink
        v-if="1 < current"
        :to="getPath(current - 1)"
        class="pagination__item pagination__item--arrow"
        aria-label="前のページへ"
      >
        <AppIcon name="arrow-back" :size="18" />
      </NuxtLink>

      <NuxtLink v-if="2 < current" :to="getPath(1)" class="pagination__item">1</NuxtLink>
      <span v-if="3 < current" class="pagination__omission">…</span>

      <template v-for="p in pager" :key="p">
        <NuxtLink
          v-if="current - 2 <= p && p <= current + 0"
          :to="getPath(p + 1)"
          class="pagination__item"
          :class="{ 'is-active': current === p + 1 }"
        >{{ p + 1 }}</NuxtLink>
      </template>

      <span v-if="current + 2 <= pager.length" class="pagination__omission">…</span>
      <NuxtLink
        v-if="current + 1 < pager.length"
        :to="getPath(pager.length)"
        class="pagination__item"
      >{{ pager.length }}</NuxtLink>

      <NuxtLink
        v-if="current < pager.length"
        :to="getPath(current + 1)"
        class="pagination__item pagination__item--arrow"
        aria-label="次のページへ"
      >
        <AppIcon name="arrow-forward" :size="18" />
      </NuxtLink>
    </div>
  </nav>
</template>

<style lang="scss" scoped>
// 背景パターン（layouts/home.vue, layouts/default.vue）の上に乗るブロック。
// 外側の.paginationは余白（パターンが見える）、.pagination__innerだけ不透明に塗る
.pagination {
  display: flex;
  justify-content: center;
  margin: 36px 0 8px;
}

.pagination__inner {
  @include content-block;

  display: flex;
  align-items: center;
  gap: 10px;
  border-radius: $radius-pill;
  padding: 10px 20px;
}

.pagination__item {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: $color-placeholder-1;
  color: $color-nav-inactive;
  font-family: $font-heading;
  font-weight: 500;
  font-size: 15px;
  text-decoration: none;
  transition: background-color 0.2s ease, color 0.2s ease;

  &:hover {
    background-color: $color-border;
    color: $color-base;
  }

  &.is-active {
    background-color: $color-primary;
    color: #fff;

    &:hover {
      background-color: $color-primary-dark;
      color: #fff;
    }
  }
}

.pagination__item--arrow {
  background-color: transparent;
  color: $color-secondary;

  &:hover {
    background-color: $color-placeholder-1;
    color: $color-secondary-dark;
  }
}

.pagination__omission {
  @include label($color-meta);
}
</style>
