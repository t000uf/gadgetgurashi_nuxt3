<script lang="ts" setup>
const route = useRoute()

// 内部リンクは末尾スラッシュ付き、サイトマップ・og:url はなし。どちらで来ても canonical は
// スラッシュなしに揃え、同じページが2つのURLで評価されないようにする
useHead({
  link: computed(() => [
    { rel: 'canonical', href: `https://gadgetgurashi.com${route.path.replace(/\/+$/, '')}` },
  ]),
})
</script>

<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>
