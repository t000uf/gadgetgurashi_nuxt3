<script lang="ts" setup>
import type { Article, MicroCMSList } from '@/types'

definePageMeta({
  layout: 'home'
})

const route = useRoute()
const page = Number(route.params.p) || 1
const limit = 10

const { data } = await useFetch<MicroCMSList<Article>>('/api/article', {
  query: {
    limit,
    offset: (page - 1) * limit,
  }
})

const pager = computed(() =>
  [...Array(Math.ceil((data.value?.totalCount ?? 0) / limit)).keys()]
)
</script>

<template>
  <div class="sentence_home">
    <h4>オタクがガジェットやその他話題について書き散らします</h4>
    <p>
      このブログはただの一般オタクが購入したガジェットやその他の話題について、レビューや感想を好き勝手書き散らした記事の置き場所です。
    </p>
    <p>
      暇つぶし程度に読んでください。素人目線なので詳細なレビューや正確な情報は他のサイトなど複数の情報を参考にしてください。
    </p>
    <p>
      更新は不定期でのんびりやっています。
    </p>
    <p>
      <NuxtLink to="/article/about">
        このブログについて
      </NuxtLink>
    </p>
    <hr>
    <h4 id="allkiji" class="headline_home">
      記事一覧
    </h4>
    <ArticleList v-if="data?.contents" :contents="data.contents" />
    <Pagination :pager="pager" :current="1" />
    <AdsByGoogle ad-slot="7173714878" />
  </div>
</template>

<style lang="scss">
.sentence_home {
  max-width: 700px;
  width: 100%;
  padding: 10px;
  box-sizing: border-box;

  @media screen and (max-width: 300px) {
    padding: 0 5px;
  }
}

.headline_home {
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
