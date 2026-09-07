<script lang="ts" setup></script>

<template>
  <aside class="side">
    <p class="side__label">SPONSORED</p>
    <AdsByGoogle ad-slot="7173714878" />
  </aside>
</template>

<style lang="scss" scoped>
// SP/PCで見た目を統一：どちらも他コンテンツと同じ規約（content-block）で塗る
// （独自の色は足さずデフォルトの$color-bgを使う）。PCのみ幅とstickyを追加する
.side {
  @include content-block;

  width: 100%;
  padding: 16px;
  border-radius: $radius-card;
}

.side__label {
  @include label($color-meta);

  margin: 0 0 10px;
}

@media screen and (max-width: $bp-sm) {
  .side {
    padding: 16px 0;
  }
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
