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
  <div class="home">
    <section class="intro">
      <p class="intro__eyebrow">WELCOME</p>
      <h1 class="intro__title">ガジェットのレビューと記録</h1>
      <p class="intro__text">
        このブログはただの一般オタクが購入したガジェットやその他の話題について、レビューや感想を好き勝手書き散らした記事の置き場所です。
        素人目線なので、詳細なレビューや正確な情報は他のサイトなど複数の情報を参考にしてください。更新は不定期でのんびりやっています。
      </p>
      <p class="intro__link">
        <NuxtLink to="/article/about">このブログについて →</NuxtLink>
      </p>
    </section>

    <div class="divider-block">
      <hr class="divider">
    </div>

    <section>
      <div class="section-heading">
        <h2 id="allkiji" class="section-title">記事一覧</h2>
      </div>
      <ArticleList v-if="data?.contents" :contents="data.contents" featured />
      <Pagination :pager="pager" :current="1" />
    </section>

    <AdsByGoogle ad-slot="7173714878" />
  </div>
</template>

<style lang="scss" scoped>
.home {
  width: 100%;
}

// 背景パターン（layouts/home.vue）の上に乗るブロックは、パターンを完全に隠すよう
// サイト背景色で不透明に塗る。ブロック同士の余白ではパターンが見える
.intro {
  background-color: $color-bg;
  border-radius: $radius-card;
  padding: 28px;
}

.intro__eyebrow {
  @include label($color-primary);

  margin: 0 0 10px;
  font-weight: 700;
}

.intro__title {
  @include heading-1;
}

.intro__text {
  margin: 0;
  color: $color-body;
  font-size: 15px;
  line-height: 1.9;
}

.intro__link {
  @include label($color-secondary);

  margin: 16px 0 0;

  a {
    text-decoration: none;
  }
}

.divider-block {
  width: 100%;
  margin-top: 32px;
  background-color: $color-bg;
  border-radius: $radius-card;
  padding: 20px 28px;
}

.divider {
  height: 1px;
  border: none;
  margin: 0;
  background-color: $color-border;
}

.section-heading {
  display: inline-block;
  margin: 36px 0 14px;
  background-color: $color-bg;
  border-radius: $radius-card;
  padding: 16px 20px;
}

.section-title {
  @include heading-2;

  margin: 0;
}
</style>
