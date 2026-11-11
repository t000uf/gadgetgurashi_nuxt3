<script lang="ts" setup>
const route = useRoute()

// URLは末尾スラッシュあり・なしのどちらでも来うる（サイトマップ・RSSはなし）。canonical と og:url は
// スラッシュなしに揃え、同じページが2つのURLで評価・シェアされないようにする
const canonicalUrl = computed(() => `https://gadgetgurashi.com${route.path.replace(/\/+$/, '')}`)

useHead({
  link: computed(() => [{ rel: 'canonical', href: canonicalUrl.value }]),
  meta: computed(() => [{ property: 'og:url', content: canonicalUrl.value }]),
})
</script>

<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>
