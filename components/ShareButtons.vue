<script lang="ts" setup>
const props = defineProps<{
  url: string
  title: string
}>()

const shareUrl = computed(() => {
  return `https://x.com/intent/tweet?url=${encodeURIComponent(props.url)}&text=${encodeURIComponent(props.title)}`
})

const copied = ref(false)
let copiedTimer: ReturnType<typeof setTimeout> | undefined

const copyLink = async () => {
  await navigator.clipboard.writeText(props.url)
  copied.value = true
  clearTimeout(copiedTimer)
  copiedTimer = setTimeout(() => {
    copied.value = false
  }, 2000)
}
</script>

<template>
  <section class="share__section">
    <div class="share">
      <span class="share__label">SHARE</span>

      <a class="share__icon" :href="shareUrl" target="_blank" rel="noopener noreferrer" aria-label="Xでシェアする">
        <AppIcon name="x" :size="16" />
      </a>

      <button type="button" class="share__icon share__icon--link" aria-label="リンクをコピーする" @click="copyLink">
        <AppIcon name="link" :size="18" />
      </button>
    </div>
    <div class="share__sub">
      <Transition name="copied">
        <span v-if="copied" class="share__copied">コピーしました</span>
      </Transition>
    </div>
  </section>
</template>

<style lang="scss" scoped>
.share__section {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}

.share {
  display: flex;
  align-items: center;
  gap: 10px;
}

.share__label {
  @include label($color-meta);

  letter-spacing: 0.08em;
}

.share__icon {
  display: flex;
  flex: none;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  padding: 0;
  border: 1px solid $color-border;
  border-radius: 50%;
  background-color: $color-card;
  color: $color-base;
  cursor: pointer;
  transition: border-color 0.15s ease, color 0.15s ease;

  &:hover {
    border-color: $color-base;
  }
}

.share__icon--link {
  border-color: $color-secondary;
  color: $color-secondary;

  &:hover {
    border-color: $color-secondary-dark;
    color: $color-secondary-dark;
  }
}

.share__copied {
  @include label($color-secondary);

  display: block;
  margin-top: 6px;
  font-size: 12px;
}

.copied-enter-active,
.copied-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}

.copied-enter-from,
.copied-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}
</style>
