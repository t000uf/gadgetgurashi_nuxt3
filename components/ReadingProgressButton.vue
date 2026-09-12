<script lang="ts" setup>
// 外周リングが読了プログレスを兼ねる「記事の先頭に戻る」ボタン。
// 独立したプログレス表示は設けず、この1つに統合する
const { returnTop } = useScrollTop()
const progress = ref(0)

const RING_RADIUS = 14
const RING_CIRCUMFERENCE = 2 * Math.PI * RING_RADIUS

const ringDash = computed(() => `${RING_CIRCUMFERENCE * progress.value} ${RING_CIRCUMFERENCE}`)

const updateProgress = () => {
  const scrollable = document.documentElement.scrollHeight - window.innerHeight
  progress.value = scrollable > 0 ? Math.min(1, window.scrollY / scrollable) : 0
}

onMounted(() => {
  updateProgress()
  window.addEventListener('scroll', updateProgress, { passive: true })
  window.addEventListener('resize', updateProgress, { passive: true })
})

onUnmounted(() => {
  window.removeEventListener('scroll', updateProgress)
  window.removeEventListener('resize', updateProgress)
})
</script>

<template>
  <button type="button" class="progress-button" aria-label="記事の先頭に戻る" @click="returnTop">
    <svg class="progress-button__ring" width="45" height="45" viewBox="0 0 34 34" aria-hidden="true">
      <circle class="progress-button__track" cx="17" cy="17" :r="RING_RADIUS" fill="none" stroke="currentColor"
        stroke-width="2.5" />
      <circle class="progress-button__value" cx="17" cy="17" :r="RING_RADIUS" fill="none" stroke="currentColor"
        stroke-width="2.5" stroke-linecap="round" :stroke-dasharray="ringDash" transform="rotate(-90 17 17)" />
    </svg>
    <AppIcon name="arrow-up" :size="24" />
  </button>
</template>

<style lang="scss" scoped>
.progress-button {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  flex: none;
  width: 45px;
  height: 45px;
  padding: 0;
  border: none;
  border-radius: 50%;
  background: none;
  color: $color-base;
  cursor: pointer;
}

.progress-button__ring {
  position: absolute;
  inset: 0;
}

.progress-button__track {
  color: $color-placeholder-1;
}

.progress-button__value {
  color: $color-primary;
}
</style>
