<script lang="ts" setup>
import { Article } from '@/types/article'

definePageMeta({
  layout: 'home'
})

const { data } = await useMicroCMSGetList<Article>({
  endpoint: 'article'
})
</script>

<template>
  <div class="sentence_home">
    <h4>オタクがガジェットやその他話題について書き散らします</h4>
    <p>⚠このオタクブログはガジェット好きな一般的大学生の手によって作られています。未実装の機能は気が向いたら実装予定です。⚠ </p>
    <p>
      <nuxt-link to="/article/about">
        このブログについて
      </nuxt-link>
    </p>
    <hr>
    <h4 id="allkiji" class="headline_home">
      記事一覧
    </h4>
    <!--
    propsの使いかたが分かり次第コンポーネント化
    <KijiList
      contents="data?"
    />
    -->
    <div id="indexApp" class="kijilist">
      <div v-for="content in data?.contents" :key="content.id" class="kiji">
        <nuxt-link :to="`/article/${content.id}/`" class="kijiLink" />
        <h3 class="title">
          {{ content.title }}
        </h3>
        <div class="thumbPre">
          <img class="thumbnail" :src="content.thumbnail?.url" :alt="content.thumbnail?.url">
          <p class="preview">
            {{ content.preview }}...
          </p>
        </div>
        <div class="kijiTags">
          <div v-for="(tag, tagkey) in content.tag" :key="tagkey" class="kijiTag">
            <nuxt-link :to="`/tag/${tag.id}/page/1/`" class="kijiTagLink" />
            <p class="kijiTagName">
              {{ tag.tagName }}
            </p>
          </div>
        </div>
      </div>
    </div>

    <adsbygoogle :ad-slot="'7472742555'" :ad-format="'auto'" :ad-style="{ display: 'block' }" />
    <!--<Pagination
      :pager="pager"
      :current="Number(page)"
    />-->
  </div>
</template>

<style lang="scss" scoped>
.sentence_home {
  max-width: 700px;
  width: 100%;
  padding: 10px;
  box-sizing: border-box;
}

.headline_home {
  position: relative;
  margin: 20px 0;
  padding: 10px;
  font-size: 18px;
}

.headline_home::after {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 5px;
  content: '';
  border-radius: 3px;
  background-image: -webkit-gradient(linear, left top, right top, from($sub-color), to($light-color));
  background-image: -webkit-linear-gradient(left, $sub-color 0%, $light-color 100%);
  background-image: linear-gradient(to right, $sub-color 0%, $light-color 100%);
}

@media screen and (max-width:300px) {
  .sentence_home {
    padding: 0 5px 0 5px;
  }
}
</style>

<style lang="scss" scoped>
//propsの使いかたが分かり次第削除
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
}

.kiji:hover {
  background-color: $light-color;
  transform: scale(1.02);
  -webkit-transform: scale(1.02);
  transition-duration: 0.5s;
  -webkit-transition-duration: 0.5s;
}

.kiji h3 {
  margin: 0 0 10px 0;
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
}

.thumbnail {
  width: 350px;
  border-radius: 10px;
  box-sizing: border-box;
}

.thumbnail img {
  width: 100%;
  height: auto;
}

.preview {
  margin: auto 20px;
  line-height: 1.7;
}

@media screen and (max-width:639px) {
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
