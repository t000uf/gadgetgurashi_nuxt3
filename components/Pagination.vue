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
        <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
          <path
            fill="currentColor"
            d="M16.88,2.88L16.88,2.88c-0.49-0.49-1.28-0.49-1.77,0l-8.41,8.41c-0.39,0.39-0.39,1.02,0,1.41l8.41,8.41 c0.49,0.49,1.28,0.49,1.77,0l0,0c0.49-0.49,0.49-1.28,0-1.77L9.54,12l7.35-7.35C17.37,4.16,17.37,3.37,16.88,2.88z"
          />
        </svg>
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
        <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
          <path
            fill="currentColor"
            d="M7.38 21.01c.49.49 1.28.49 1.77 0l8.31-8.31c.39-.39.39-1.02 0-1.41L9.15 2.98c-.49-.49-1.28-.49-1.77 0s-.49 1.28 0 1.77L14.62 12l-7.25 7.25c-.48.48-.48 1.28.01 1.76z"
          />
        </svg>
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
  gap: 8px;
  border-radius: $radius-pill;
  padding: 8px 16px;
}

.pagination__item {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 34px;
  height: 34px;
  border-radius: 50%;
  background-color: $color-placeholder-1;
  color: $color-nav-inactive;
  font-family: $font-heading;
  font-weight: 500;
  font-size: 14px;
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
