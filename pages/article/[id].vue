<script lang="ts" setup>
import type { MicroCMSListContent } from 'microcms-js-sdk'
import type { Article } from '@/types'

const { format } = useDate()

const route = useRoute()
const { data: content } = await useFetch<MicroCMSListContent & Article>(
  `/api/article/${route.params.id}`,
  { query: { depth: 2 } }
)

useHead({
  title: computed(() => `${content.value?.title} - がじぇっとぐらし！`),
  meta: computed(() => [
    { name: 'description', content: content.value?.preview },
    { property: 'og:type', content: 'blog' },
    { property: 'og:title', content: `${content.value?.title} - がじぇっとぐらし！` },
    { property: 'og:description', content: content.value?.preview },
    { property: 'og:url', content: `https://gadgetgurashi.com/article/${content.value?.id}` },
    { property: 'og:image', content: content.value?.thumbnail?.url },
    { name: 'twitter:card', content: 'summary_large_image' },
  ])
})
</script>

<template>
  <div v-if="content" class="sentence">
    <h2 id="articleTitle">
      {{ content.title }}
    </h2>
    <p class="date">投稿日時：{{ format(content.createdAt) }}</p>
    <p class="date">更新日時：{{ format(content.revisedAt) }}</p>
    <img class="article_thumbnail" :src="content.thumbnail?.url" :alt="content.title">
    <div class="articleText" v-html="content.text" />
    <div class="affiliate">
      <p>関連商品リンク</p>
      <div v-html="content.affiliate" />
    </div>
    <AdsByGoogle ad-slot="7173714878" />
    <h4 class="headline">
      「{{ content.title }}」に関連する記事
    </h4>
    <ArticleList v-if="content.related" :contents="content.related" />
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

.article_thumbnail {
  width: 100%;
  max-width: 700px;
  box-sizing: border-box;
  border-radius: 10px;
  margin: 10px 0 30px 0;
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

.affiliate {
  border: 2px solid $main-color;
  border-radius: 10px;
  margin: 20px auto 50px auto;
  padding: 0 20px;
  max-width: 400px;
  width: 100%;
  box-sizing: border-box;
  background-color: #ffffff;
  word-break: break-all;

  :deep(img) {
    width: 100%;
    max-width: 700px;
    box-sizing: border-box;
    border-radius: 10px;
    margin: 10px 0 30px 0;
  }
}

.headline {
  position: relative;
  margin: 20px 0;
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
</style>
