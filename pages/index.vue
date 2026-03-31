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
    <p>⚠このオタクブログはガジェット好きな一般的大学生の手によって作られています。未実装の機能は気が向いたら実装予定です。⚠</p>
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
