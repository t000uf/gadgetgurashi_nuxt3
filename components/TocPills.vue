<script lang="ts" setup>
// 現在地を示す横スクロールのピル列。SPのバーとPCのサイドバーで共用する
import type { TocItem } from '@/composables/useToc'
import { activeTocIds } from '@/composables/useToc'

const props = defineProps<{
  toc: TocItem[]
  activeId: string
}>()

const emit = defineEmits<{ select: [] }>()

const rowRef = ref<HTMLElement>()

const activeIds = computed(() => activeTocIds(props.toc, props.activeId))

// h4は親のh3が現在地のときだけ出す（普段はh3だけの一覧）。
// 親を持たないh4は畳む相手がいないので常に出す
const visiblePills = computed(() => {
  return props.toc.filter((item) => {
    return item.level !== 'h4' || !item.parentId || activeIds.value.has(item.parentId)
  })
})

// CSSの .toc-pills の gap と揃える
const PILL_GAP = 6

// 読み進めるとピル列が横スクロールして現在地が見える位置に来る。
// scrollIntoViewはページ自体も縦に動かしてしまうので、列のscrollLeftだけを動かす
const scrollActivePillIntoView = async () => {
  await nextTick()
  const row = rowRef.value
  if (!row) return
  const index = visiblePills.value.findIndex((item) => item.id === props.activeId)
  const pill = row.children[index] as HTMLElement | undefined
  if (!pill) return

  // stickyは場所を取らず上に重なるだけなので、左端に貼り付いたh3の幅ぶんは常に隠れる
  const stickyIndex = visiblePills.value.findIndex((item) => {
    return item.level === 'h3' && activeIds.value.has(item.id)
  })
  const sticky = stickyIndex >= 0 && stickyIndex !== index
    ? (row.children[stickyIndex] as HTMLElement | undefined)
    : undefined
  const blindSpot = sticky ? sticky.offsetWidth + PILL_GAP : 0

  // すでに見えているなら動かさない。毎回詰め直すと、同じセクションを読んでいる間に
  // 先に読んだ兄弟h4が固定中のh3の下へ流れていってしまう
  const offsetInView = pill.offsetLeft - row.scrollLeft
  if (offsetInView >= blindSpot && offsetInView + pill.offsetWidth <= row.clientWidth) return

  row.scrollTo({ left: pill.offsetLeft - blindSpot, behavior: 'smooth' })
}

watch(() => props.activeId, scrollActivePillIntoView)
</script>

<template>
  <div ref="rowRef" class="toc-pills">
    <a v-for="item in visiblePills" :key="item.id" :href="`#${item.id}`" class="toc-pills__pill"
      :class="[`toc-pills__pill--${item.level}`, { 'is-active': activeIds.has(item.id) }]"
      @click="emit('select')">{{ item.text }}</a>
  </div>
</template>

<style lang="scss" scoped>
.toc-pills {
  position: relative; // ピルのoffsetLeftをこの列基準で測るため
  display: flex;
  overflow-x: auto;
  gap: 6px;
  min-width: 0;
  scrollbar-width: none;

  &::-webkit-scrollbar {
    display: none;
  }
}

// メトリクスはbadge()と同じ。淡い塗り／ベタ塗りの2状態が要るのでmixinは使わず展開する
.toc-pills__pill {
  flex: none;
  overflow: hidden;
  // 列の見えている幅を上限にする。vw基準だと置き場所（バー／サイドバー）の幅と噛み合わない
  max-width: 100%;
  padding: 4px 12px;
  border-radius: $radius-pill;
  font-family: $font-heading;
  font-weight: 700;
  font-size: 12px;
  line-height: 1.4;
  text-decoration: none;
  text-overflow: ellipsis;
  white-space: nowrap;
  transition: background-color 0.2s ease, color 0.2s ease;
}

// 通常は淡い塗りで控えさせ、現在地だけベタ塗りにして読んでいる場所を際立たせる
.toc-pills__pill--h2,
.toc-pills__pill--h3 {
  background-color: rgba($color-primary, 0.12);
  color: $color-primary;

  &.is-active {
    background-color: $color-primary;
    color: #fff;
  }
}

// 現在のセクションの見出しは左端に貼り付け、配下のh4がその右を流れるようにする
.toc-pills__pill--h3.is-active {
  position: sticky;
  left: 0;
  z-index: 1;
}

.toc-pills__pill--h4 {
  background-color: rgba($color-secondary, 0.12);
  color: $color-secondary;

  &.is-active {
    background-color: $color-secondary;
    color: #fff;
  }
}
</style>
