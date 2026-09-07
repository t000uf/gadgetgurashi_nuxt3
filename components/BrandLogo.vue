<script lang="ts" setup>
// ロゴマークは仮置き（別途デザイン予定）。角丸スクエア＋circleのシンプルなマーク
withDefaults(defineProps<{ size?: number }>(), { size: 24 })
</script>

<template>
  <svg
    :width="size"
    :height="size"
    viewBox="0 0 100 100"
    role="img"
    aria-label="がじぇっとぐらし！"
    class="brand-logo"
  >
    <rect x="10" y="10" width="80" height="80" rx="22" fill="#1f2530" />
    <rect x="30" y="30" width="40" height="40" rx="10" fill="none" stroke="#e8791e" stroke-width="7" />
    <circle cx="76" cy="76" r="9" fill="#e8791e" />
  </svg>
</template>

<style lang="scss" scoped>
.brand-logo {
  display: block;
  flex: none;
}
</style>
