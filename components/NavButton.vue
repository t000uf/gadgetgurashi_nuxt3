<script lang="ts" setup>
const { returnTop } = useScrollTop()
const tocState = useTocState()

const hasToc = computed(() => tocState.value.toc.length > 0)

// 目次バーが出ている間は、そこの読了リング付き↑が役割を担うのでこちらは出さない。
// 本文を読み終えてバーがしまわれたら、関連記事やフッターで戻る手段が無くなるため復帰させる
const isTocBarVisible = computed(() => hasToc.value && tocState.value.isInBody)

const buttonActive = ref(false)

const scrollWindow = () => {
  buttonActive.value = 400 < window.scrollY
}

onMounted(() => {
  scrollWindow()
  window.addEventListener('scroll', scrollWindow, { passive: true })
})

onUnmounted(() => {
  window.removeEventListener('scroll', scrollWindow)
})
</script>

<template>
  <Transition name="fade">
    <button v-show="buttonActive && !isTocBarVisible" type="button" class="nav-button"
      :class="{ 'is-article': hasToc }" aria-label="ページ上部へ戻る" @click="returnTop">
      <AppIcon name="arrow-up" :size="22" />
    </button>
  </Transition>
</template>

<style lang="scss" scoped>
.nav-button {
  position: fixed;
  right: 24px;
  bottom: 32px;
  z-index: 900;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 44px;
  height: 44px;
  border: none;
  border-radius: 50%;
  background-color: $color-primary;
  color: #fff;
  cursor: pointer;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: $color-primary-dark;
  }
}

// PCの記事ページはサイドバーの目次に↑があり、そちらは最後まで見えているので重複させない
@media screen and (min-width: $bp-lg) {
  .nav-button.is-article {
    display: none;
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

@media screen and (max-width: $bp-sm) {
  .nav-button {
    right: 16px;
    bottom: 20px;
  }
}
</style>
