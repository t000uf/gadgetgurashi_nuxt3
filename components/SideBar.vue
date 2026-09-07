<script lang="ts" setup></script>

<template>
  <aside class="side">
    <p class="side__label">SPONSORED</p>
    <AdsByGoogle ad-slot="7173714878" />
  </aside>
</template>

<style lang="scss" scoped>
.side {
  width: 100%;
}

.side__label {
  @include label-mono(12px, $color-meta);

  margin: 0 0 10px;
}

@media screen and (min-width: $bp-lg) {
  .side {
    position: sticky;
    top: $header-height + 24px;
    width: $sidebar-width;
    flex: none;
    padding: 16px;
    border-radius: $radius-card;
    background-color: $color-card;
  }
}
</style>
