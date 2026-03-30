<script lang="ts" setup>
import type { MicroCMSListContent } from 'microcms-js-sdk'
import type { Article } from '@/types/article'

defineProps<{
  content: MicroCMSListContent & Article
}>()
</script>

<template>
  <div class="kiji">
    <NuxtLink :to="`/article/${content.id}/`" class="kijiLink" />
    <h3 class="title">
      {{ content.title }}
    </h3>
    <div class="thumbPre">
      <img class="thumbnail" :src="content.thumbnail?.url" :alt="content.title">
      <p class="preview">
        {{ content.preview }}...
      </p>
    </div>
    <div class="kijiTags">
      <div v-for="(tag, tagkey) in content.tag" :key="tagkey" class="kijiTag">
        <NuxtLink :to="`/tag/${tag.id}/page/1/`" class="kijiTagLink" />
        <p class="kijiTagName">
          {{ tag.tagName }}
        </p>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.kiji {
  position: relative;
  box-sizing: border-box;
  width: 100%;
  min-height: max-content;
  border-left: $sub-color 10px solid;
  border-radius: 0 10px 10px 0;
  margin-bottom: 30px;
  padding: 10px 10px 10px 20px;
  background-color: $light-color;
  box-shadow: $bg-gray 10px 7px 5px;
  object-fit: cover;

  &:hover {
    transform: scale(1.02);
    transition-duration: 0.5s;
  }

  h3 {
    margin: 0 0 10px 0;
  }
}

.kijiLink {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.kijiTags {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  width: 100%;
  word-break: keep-all;
}

.kijiTag {
  position: relative;
  display: flex;
  height: 100%;
  margin: 10px 10px 0 0;
  padding: 5px;
  border-radius: 5px;
  background-color: $sub-color;
  color: $text-color;
}

.kijiTagLink {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  text-decoration: none;
}

.kijiTagName {
  margin: 0;
}

.thumbPre {
  display: flex;
  flex-direction: row;
  justify-content: space-evenly;
  align-items: center;
  width: 100%;
  overflow: hidden; // 追加
}

.thumbnail {
  width: 350px;
  max-width: 50%; // 追加
  height: auto; // 追加
  border-radius: 10px;
  box-sizing: border-box;
  flex-shrink: 0; // 追加（縮みすぎ防止）
}

.preview {
  margin: auto 20px;
  line-height: 1.7;
}

@media screen and (max-width: 639px) {
  .kiji {
    padding: 10px;
  }

  .thumbPre {
    flex-direction: column;
  }

  .thumbnail {
    width: 100%;
    margin: 0;
  }

  .preview {
    margin: 10px 0;
  }
}
</style>
