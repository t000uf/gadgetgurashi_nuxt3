<script lang="ts" setup>
import type { MicroCMSListContent } from 'microcms-js-sdk'
import type { Article } from '@/types'

defineProps<{
  contents: (MicroCMSListContent & Article)[]
}>()
</script>

<template>
  <div id="indexApp" class="kijilist">
    <ArticleCard v-for="content in contents" :key="content.id" :content="content" />
  </div>
</template>
