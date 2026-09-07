<script lang="ts" setup>
// ホームページ全体の背景に敷くガジェットモチーフの装飾パターン。
// 4x2の正方形グリッドを30°回転させつつ、各アイコン自体はpatternTransformの逆回転で
// 正立(0°)を維持する。タイルは継ぎ目なく反復する。
// コンテンツ側の実装は layouts/home.vue 参照（この上に乗る各ブロックは
// background-color: $color-bg で不透明に塗り、隙間だけこのパターンを見せる）。
</script>

<template>
  <svg class="bg-pattern" aria-hidden="true" focusable="false">
    <defs>
      <g id="ic-phone">
        <rect x="7" y="2" width="14" height="24" rx="4" stroke="#c7cfd9" stroke-width="2" fill="none" stroke-linejoin="round" />
        <line x1="11" y1="21" x2="17" y2="21" stroke="#c7cfd9" stroke-width="2" stroke-linecap="round" />
      </g>
      <g id="ic-headphone">
        <path d="M6 18 Q6 6 14 6 Q22 6 22 18" stroke="#c7cfd9" stroke-width="2" fill="none" stroke-linecap="round" />
        <rect x="3" y="16" width="6" height="9" rx="2.5" stroke="#c7cfd9" stroke-width="2" fill="none" />
        <rect x="19" y="16" width="6" height="9" rx="2.5" stroke="#c7cfd9" stroke-width="2" fill="none" />
      </g>
      <g id="ic-watch">
        <rect x="8" y="8" width="12" height="14" rx="4" stroke="#c7cfd9" stroke-width="2" fill="none" />
        <line x1="11" y1="8" x2="11" y2="3" stroke="#c7cfd9" stroke-width="2" stroke-linecap="round" />
        <line x1="17" y1="8" x2="17" y2="3" stroke="#c7cfd9" stroke-width="2" stroke-linecap="round" />
        <line x1="11" y1="22" x2="11" y2="27" stroke="#c7cfd9" stroke-width="2" stroke-linecap="round" />
        <line x1="17" y1="22" x2="17" y2="27" stroke="#c7cfd9" stroke-width="2" stroke-linecap="round" />
      </g>
      <g id="ic-router">
        <rect x="3" y="12" width="22" height="9" rx="3" stroke="#c7cfd9" stroke-width="2" fill="none" />
        <line x1="9" y1="12" x2="9" y2="5" stroke="#c7cfd9" stroke-width="2" stroke-linecap="round" />
        <line x1="19" y1="12" x2="19" y2="5" stroke="#c7cfd9" stroke-width="2" stroke-linecap="round" />
      </g>
      <g id="ic-mug">
        <path d="M5 8 h14 v11 a5 5 0 0 1 -5 5 h-4 a5 5 0 0 1 -5 -5 z" stroke="#c7cfd9" stroke-width="2" fill="none" stroke-linejoin="round" />
        <path d="M19 11 h3 a3.5 3.5 0 0 1 0 7 h-3" stroke="#c7cfd9" stroke-width="2" fill="none" stroke-linecap="round" />
      </g>
      <g id="ic-bulb">
        <path d="M14 4 a7 7 0 0 1 4.5 12.4 c-1 .9 -1.5 1.9 -1.5 3.1 h-6 c0 -1.2 -.5 -2.2 -1.5 -3.1 A7 7 0 0 1 14 4 Z" stroke="#c7cfd9" stroke-width="2" fill="none" stroke-linejoin="round" />
        <line x1="11" y1="23" x2="17" y2="23" stroke="#c7cfd9" stroke-width="2" stroke-linecap="round" />
        <line x1="12" y1="26" x2="16" y2="26" stroke="#c7cfd9" stroke-width="2" stroke-linecap="round" />
      </g>

      <!--
        実装のコツ：patternTransform で全体を回転させ、各アイコンには逆方向の
        rotate() を個別にかけて相殺する。グリッドの配置角度だけが回転し、
        アイコンの向きは0°のまま。
        タイルは実寸のページ全体に敷くため、モックのデモ用スケール(0.46)より
        大きめ(0.85)にして、フル幅で見ても視認できるサイズにしている。
      -->
      <pattern id="gadget-grid" width="144" height="216" patternUnits="userSpaceOnUse" patternTransform="rotate(30)">
        <g transform="translate(8,8) scale(0.85) rotate(-30,14,14)"><use href="#ic-phone" /></g>
        <g transform="translate(80,8) scale(0.85) rotate(-30,14,14)"><use href="#ic-headphone" /></g>
        <g transform="translate(8,80) scale(0.85) rotate(-30,14,14)"><use href="#ic-watch" /></g>
        <g transform="translate(80,80) scale(0.85) rotate(-30,14,14)"><use href="#ic-router" /></g>
        <g transform="translate(8,152) scale(0.85) rotate(-30,14,14)"><use href="#ic-mug" /></g>
        <g transform="translate(80,152) scale(0.85) rotate(-30,14,14)"><use href="#ic-bulb" /></g>
      </pattern>
    </defs>
    <rect width="100%" height="100%" fill="url(#gadget-grid)" />
  </svg>
</template>

<style lang="scss" scoped>
.bg-pattern {
  position: absolute;
  inset: 0;
  z-index: -1;
  width: 100%;
  height: 100%;
  pointer-events: none;
}
</style>
