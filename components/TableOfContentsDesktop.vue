<script lang="ts" setup>
// PC用: サイドバー(広告の上)に置く目次。閉じている間は現在地をピル列で示し、
// 見出しタップで全見出しの一覧を開く（仕組みはSPのバーと同じ）
const state = useTocState()
const isOpen = ref(false)

const toggle = () => {
  isOpen.value = !isOpen.value
}
</script>

<template>
  <div v-if="state.toc.length" class="toc-panel">
    <div class="toc-panel__head">
      <p class="toc-panel__heading">
        <span class="toc-panel__label">もくじ</span>
        <span class="toc-panel__title">{{ state.title }}</span>
      </p>
      <ReadingProgressButton />
    </div>

    <div id="toc-panel-list" class="toc-panel__list" :class="{ 'is-open': isOpen }" :inert="!isOpen">
      <div class="toc-panel__list-inner">
        <TocList :toc="state.toc" :active-id="state.activeId" @select="toggle" />
      </div>
    </div>

    <TocPills :toc="state.toc" :active-id="state.activeId" />

    <button type="button" class="toc-panel__toggle" :aria-expanded="isOpen" aria-controls="toc-panel-list"
      :aria-label="isOpen ? 'もくじを閉じる' : 'もくじを開く'" @click="toggle">
      <AppIcon name="chevron-down" :size="16" class="toc-panel__chevron" :class="{ 'is-open': isOpen }" />
    </button>
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
  margin-bottom: 8px;
}

.toc-panel__heading {
  display: flex;
  align-items: center;
  gap: 6px;
  overflow: hidden;
  min-width: 0;
  margin: 0;
}

// ピル列の下の行に置く開閉ボタン。SPのハンドルと同じ位置関係にする
.toc-panel__toggle {
  display: flex;
  justify-content: center;
  width: 100%;
  padding: 6px 0 2px;
  border: none;
  background: none;
  cursor: pointer;
}

.toc-panel__label {
  @include label($color-meta);

  flex: none;
  font-size: 12px;
}

.toc-panel__title {
  overflow: hidden;
  min-width: 0;
  color: $color-base;
  font-family: $font-heading;
  font-weight: 700;
  font-size: 13px;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.toc-panel__chevron {
  flex: none;
  color: $color-meta;
  transition: transform 0.2s ease;

  &.is-open {
    transform: rotate(180deg);
  }
}

// 閉じている間は高さ0。SPのバーと同じ時間・イージングで開閉する
.toc-panel__list {
  overflow: hidden;
  max-height: 0;
  transition: max-height 0.25s ease;

  &.is-open {
    overflow-y: auto;
    max-height: 60vh;
  }
}

.toc-panel__list-inner {
  padding: 4px 0 10px;
}

// 一覧を開いたら現在地のピル列は畳む（一覧側がその役目を引き取るため）
.toc-panel__pills {
  max-height: 40px;
  opacity: 1;
  transition: max-height 0.25s ease, opacity 0.25s ease;

  &.is-hidden {
    max-height: 0;
    opacity: 0;
  }
}
</style>
