<script lang="ts" setup>
// PC用: サイドバー(広告の上)に置く常設の目次
const state = useTocState()
</script>

<template>
  <div v-if="state.toc.length" class="toc-panel">
    <div class="toc-panel__head">
      <p class="toc-panel__label">もくじ</p>
      <ReadingProgressButton />
    </div>
    <TocList :toc="state.toc" :active-id="state.activeId" />
  </div>
</template>

<style lang="scss" scoped>
.toc-panel {
  display: none;
}

// stickyは親の.side側が担うので、ここは余白だけ持つ
@media screen and (min-width: $bp-lg) {
  .toc-panel {
    display: block;
    margin-bottom: 16px;
  }
}

.toc-panel__head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 8px;
  margin-bottom: 10px;
}

.toc-panel__label {
  @include label($color-meta);

  margin: 0;
}
</style>
