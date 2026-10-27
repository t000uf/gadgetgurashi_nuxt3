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
    <rect class="brand-logo__base" x="10" y="10" width="80" height="80" rx="22" />
    <rect class="brand-logo__frame" x="30" y="30" width="40" height="40" rx="10" fill="none" stroke-width="7" />
    <circle class="brand-logo__dot" cx="76" cy="76" r="9" />
  </svg>
</template>

<style lang="scss" scoped>
.brand-logo {
  display: block;
  flex: none;
}

// 色はSVG属性ではなくトークンで当てる（ダークで土台のスクエアがピルに沈まないよう反転させる）
.brand-logo__base {
  fill: $color-base;
}

.brand-logo__frame {
  stroke: $color-primary;
}

.brand-logo__dot {
  fill: $color-primary;
}
</style>
