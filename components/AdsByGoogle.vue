<script lang="ts" setup>
defineProps<{
  adSlot: string
  adFormat?: string
  adStyle?: Record<string, string>
}>()

const runtimeConfig = useRuntimeConfig()
const adClient = runtimeConfig.public.adsenseId
</script>

<template>
  <ClientOnly>
    <ins class="adsbygoogle" :style="adStyle ?? { display: 'block' }" :data-ad-client="adClient" :data-ad-slot="adSlot"
      :data-ad-format="adFormat ?? 'auto'" data-full-width-responsive="true" />
  </ClientOnly>
</template>
