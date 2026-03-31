<script lang="ts" setup>
import type { About } from '@/types'

const { format } = useDate()

const { data: content } = await useMicroCMSGetListDetail<About>({
  endpoint: 'about',
  contentId: 'about' as string,
})

useHead({
  title: computed(() => `${content.value?.title} - がじぇっとぐらし！`),
})
</script>

<template>
  <div v-if="content" class="sentence">
    <h2 id="articleTitle">
      {{ content.title }}
    </h2>
    <p class="date">更新日時：{{ format(content.revisedAt) }}</p>
    <div class="articleText" v-html="content.text" />
  </div>
</template>

<style lang="scss" scoped>
.sentence {
  max-width: 700px;
  width: 100%;
  padding: 10px;
  box-sizing: border-box;
}

#articleTitle {
  border-left: $main-color 5px solid;
  padding-left: 10px;
}

.articleText {
  max-width: 700px;

  :deep(p) {
    line-height: 2;
    padding: 3px;
  }

  :deep(img) {
    width: 100%;
    max-width: 700px;
    box-sizing: border-box;
    border-radius: 10px;
    margin: 10px 0 30px 0;
  }

  :deep(h3) {
    display: flex;
    align-items: center;
    position: sticky;
    top: 70px;
    height: 55px;
    border-radius: 10px;
    margin-bottom: 60px;
    padding: 10px;
    background-image: linear-gradient(to right, $sub-color 0%, $main-color 100%);
    box-shadow: $bg-gray 0.5px 1px 1px;
    font-size: 20px;
    z-index: 10;

    &::before {
      position: absolute;
      content: '';
      bottom: -11px;
      left: 1em;
      width: 25px;
      height: 25px;
      background-color: $sub-color;
      border-radius: 2px;
      box-shadow: $bg-gray 1px 0.5px 0.5px;
      transform: rotate(45deg);
      z-index: 15;
    }
  }

  :deep(h4) {
    position: relative;
    margin: 20px 0 0 0;
    padding: 10px;
    font-size: 18px;

    &::after {
      position: absolute;
      bottom: 0;
      left: 0;
      width: 100%;
      height: 5px;
      content: '';
      border-radius: 3px;
      background-image: linear-gradient(to right, $sub-color 0%, $light-color 100%);
    }
  }
}

.date {
  text-align: right;
  font-size: 12px;
}
</style>
