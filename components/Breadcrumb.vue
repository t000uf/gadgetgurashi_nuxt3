<script lang="ts" setup>
defineProps<{
  current?: string
}>()
</script>

<template>
  <p class="breadcrumb">
    <NuxtLink to="/" class="breadcrumb__home">
      <AppIcon name="arrow-back" :size="14" />
      TOP
    </NuxtLink>
    <span v-if="current"> / {{ current }}</span>
  </p>
</template>

<style lang="scss" scoped>
.breadcrumb {
  @include label($color-meta);

  margin: 0 0 14px;
}

.breadcrumb__home {
  display: inline-flex;
  align-items: center;
  gap: 2px;
  color: inherit;
  text-decoration: none;
  transition: color 0.2s ease;

  &:hover {
    color: $color-primary;
  }
}
</style>
