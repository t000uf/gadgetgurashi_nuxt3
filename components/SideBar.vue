<script lang="ts" setup>
const articleShare = useArticleShare()
</script>

<template>
  <aside class="side">
    <div class="side__toc">
      <TableOfContentsDesktop />
    </div>

    <ShareButtons v-if="articleShare" :url="articleShare.url" :title="articleShare.title" />

    <div class="side__sponsord">
      <p class="side__sponsord__label">SPONSORED</p>
      <AdsByGoogle ad-slot="7173714878" />
    </div>
  </aside>
</template>

<style lang="scss" scoped>
// SP/PCで見た目を統一：どちらも他コンテンツと同じ規約（content-block）で塗る
// （独自の色は足さずデフォルトの$color-bgを使う）。PCのみ幅とstickyを追加する。
// もくじ／シェア／広告はそれぞれ別のまとまりなので、ブロックを分けて余白でパターンを見せる
.side {
  display: flex;
  flex-direction: column;
  gap: 16px;
  width: 100%;
  // 1カラムのSP/タブレットでは本文の下に積まれるので、本文と同じ幅で揃える
  max-width: $content-width;
}

// もくじパネル自体がPC限定（display:noneをブレークポイントで解除）なので、
// SPで空のカードが出ないようラッパーも同じ条件で表示する
.side__toc {
  display: none;

  @media screen and (min-width: $bp-lg) {
    display: block;

    @include content-card(8px);
  }
}

.side__sponsord {
  @include content-card(8px, 16px 0);
}

.side__sponsord__label {
  @include label($color-meta);

  margin: 0 0 10px;
}

@media screen and (min-width: $bp-lg) {
  .side {
    position: sticky;
    top: $header-height + 24px;
    width: $sidebar-width;
    flex: none;
  }
}
</style>
