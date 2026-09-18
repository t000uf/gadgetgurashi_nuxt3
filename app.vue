<script lang="ts" setup>
const route = useRoute()

useHead({
  link: computed(() => [
    { rel: 'canonical', href: `https://gadgetgurashi.com${route.path}` },
  ]),
})
</script>

<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>
