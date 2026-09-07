<script lang="ts" setup>
import type { MicroCMSListContent } from 'microcms-js-sdk'
import type { Tag } from '@/types'

defineProps<{
  tags: (MicroCMSListContent & Tag)[]
}>()
</script>

<template>
  <div class="tags">
    <div v-for="(tag, key) in tags" :key="key" class="tag">
      <NuxtLink :to="`/tag/${tag.id}/page/1/`" class="tagLink" />
      <p class="tagName">
        {{ tag.tagName }}
      </p>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.tags {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  width: 100%;
  word-break: keep-all;
}

.tag {
  position: relative;
  margin: 0 10px 10px 0;
  padding: 10px;
  background-color: $bg-lightgray;
  box-shadow: $bg-gray 5px 5px 3px;
  color: $text-color;
  border-radius: 10px;
  height: 50px;
  box-sizing: border-box;
}

.tagLink {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  text-decoration: none;
}

.tagName {
  margin: 0;
}
</style>
