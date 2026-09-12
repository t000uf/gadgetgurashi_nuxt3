<script lang="ts" setup>
// SP・タブレット用: 画面下部に固定するバー。閉じている間は全見出しを横スクロールのピル列で示し、
// ハンドルをタップすると全見出しが上方向に開く。
// position: fixed を使うため、backdrop-filterを持つ記事カードの中ではなく
// レイアウト直下（NavButtonと同じ階層）に置くこと
const state = useTocState()
const isOpen = ref(false)
const containerRef = ref<HTMLElement>()

const close = () => {
  isOpen.value = false
}

// ドラッグ（上に引けば開く／下に引けば閉じる）。しきい値を超えた時点で確定させ、
// 指を離すまで待たないことで、シートを掴んで動かした感触にする
const DRAG_THRESHOLD = 24
let dragStartY: number | null = null
let didDrag = false

const onHandlePointerDown = (e: PointerEvent) => {
  dragStartY = e.clientY
  didDrag = false
    ; (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId)
}

const onHandlePointerMove = (e: PointerEvent) => {
  if (dragStartY === null) return
  const draggedUp = dragStartY - e.clientY
  if (Math.abs(draggedUp) < DRAG_THRESHOLD) return
  isOpen.value = draggedUp > 0
  dragStartY = null
  didDrag = true
}

const onHandlePointerUp = () => {
  dragStartY = null
}

// ドラッグの指離しでもclickは発火するので、確定済みのときは戻さないようにする
const toggle = () => {
  if (didDrag) {
    didDrag = false
    return
  }
  isOpen.value = !isOpen.value
}

const handleKeydown = (e: KeyboardEvent) => {
  if (e.key === 'Escape') close()
}

const handlePointerDown = (e: PointerEvent) => {
  if (!containerRef.value?.contains(e.target as Node)) close()
}

// 開いたままバーがしまわれると、画面外に一覧が残ったままになる
watch(() => state.value.isInBody, (isInBody) => {
  if (!isInBody) close()
})

// 開いている間だけ、Escapeキーと外側のタップで閉じる
watch(isOpen, (open) => {
  if (open) {
    document.addEventListener('keydown', handleKeydown)
    document.addEventListener('pointerdown', handlePointerDown)
    return
  }
  document.removeEventListener('keydown', handleKeydown)
  document.removeEventListener('pointerdown', handlePointerDown)
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeydown)
  document.removeEventListener('pointerdown', handlePointerDown)
})
</script>

<template>
  <div v-if="state.toc.length" ref="containerRef" class="toc-bar" :class="{ 'is-hidden': !state.isInBody }">
    <button type="button" class="toc-bar__handle" :aria-expanded="isOpen" aria-controls="toc-bar-list"
      :aria-label="isOpen ? 'もくじを閉じる' : 'もくじを開く'" @click="toggle" @pointerdown="onHandlePointerDown"
      @pointermove="onHandlePointerMove" @pointerup="onHandlePointerUp" @pointercancel="onHandlePointerUp" />

    <div class="toc-bar__wrap">
      <div class="toc-bar__main">
        <p class="toc-bar__head">
          <span class="toc-bar__head-label">もくじ</span>
          <span class="toc-bar__head-title">{{ state.title }}</span>
        </p>

        <div id="toc-bar-list" class="toc-bar__list" :class="{ 'is-open': isOpen }" :inert="!isOpen">
          <div class="toc-bar__list-inner">
            <TocList :toc="state.toc" :active-id="state.activeId" @select="close" />
          </div>
        </div>

        <div class="toc-bar__current" :class="{ 'is-hidden': isOpen }" :inert="isOpen">
          <TocPills :toc="state.toc" :active-id="state.activeId" class="toc-bar__pills" />
        </div>
      </div>
      <div class="toc-bar__sub">
        <ReadingProgressButton class="toc-bar__progress" />
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
// PCはサイドバーの常設パネル（TableOfContentsDesktop）に任せる
@media screen and (min-width: $bp-lg) {
  .toc-bar {
    display: none;
  }
}

// 本文の上に重なるので、ヘッダーのピルより透かして下の記事を見せる
.toc-bar {
  @include content-block($color-header-bg, $opacity-overlay);

  position: fixed;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 900;
  // タブレット（$bp-lg直下のiPad Proなど）で間延びしないよう、本文カラムの幅に合わせて中央に置く
  max-width: $content-width;
  margin: 0 auto;
  border-radius: $radius-card $radius-card 0 0;
  transition: transform 0.25s ease;

  // 本文を読み終えたら下にしまう。関連記事やフッターに被らせない
  &.is-hidden {
    transform: translateY(100%);
  }
}

.toc-bar__wrap {
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  margin-bottom: 10px;
}

// 左カラム：ハンドル・タイトル・目次。min-width:0がないと中のピル列が横スクロールしない
.toc-bar__main {
  flex: 1;
  min-width: 0;
}

.toc-bar__sub {
  display: flex;
  align-items: center;
  margin-right: 10px;
}

// 32×4pxのつまみだけでは当たり判定が小さいので、ボタン自体は全幅で確保する
.toc-bar__handle {
  display: flex;
  justify-content: center;
  width: 100%;
  padding: 8px 0 4px;
  border: none;
  background: none;
  cursor: grab;
  touch-action: none; // 縦ドラッグをページスクロールに取られないようにする

  &:active {
    cursor: grabbing;
  }

  &::before {
    width: 32px;
    height: 4px;
    border-radius: $radius-bar;
    background-color: $color-border;
    content: '';
  }
}

// ハンドル直下に置き、開いているときは一覧の、閉じているときはピル列の見出しになる
.toc-bar__head {
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 0;
  padding: 0 14px 5px;
}

.toc-bar__head-label {
  @include label($color-meta);

  flex: none;
  font-size: 12px;
}

.toc-bar__head-title {
  overflow: hidden;
  min-width: 0;
  color: $color-base;
  font-family: $font-heading;
  font-weight: 700;
  font-size: 14px;
  white-space: nowrap;
  text-overflow: ellipsis;
}

// 閉じている間は高さ0。開くと上方向に伸びる（bottom固定なのでバーごとせり上がる）
.toc-bar__list {
  overflow: hidden;
  max-height: 0;
  transition: max-height 0.25s ease;

  &.is-open {
    overflow-y: auto;
    max-height: 60vh;
  }
}

.toc-bar__list-inner {
  padding: 4px 16px 16px;
}

// 一覧と同じ時間・イージングで畳む。片方だけ即時に消えると開閉で挙動がちぐはぐに見える
.toc-bar__current {
  display: flex;
  align-items: center;
  overflow: hidden;
  gap: 10px;
  max-height: 60px;
  padding: 2px 14px 10px;
  transition: max-height 0.25s ease, padding 0.25s ease, opacity 0.25s ease;

  &.is-hidden {
    max-height: 0;
    padding-top: 0;
    padding-bottom: 0;
    opacity: 0;
  }
}

.toc-bar__pills {
  flex: 1;
}
</style>
