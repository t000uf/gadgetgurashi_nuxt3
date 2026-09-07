<script lang="ts" setup>
const { returnTop } = useScrollTop()

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
    <button v-show="buttonActive" type="button" class="nav-button" aria-label="ページ上部へ戻る"
      @click="returnTop">
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
