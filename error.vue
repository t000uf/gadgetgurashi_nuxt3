<script lang="ts" setup>
defineProps<{
  error: {
    statusCode: number
    message: string
  }
}>()

useHead({
  title: 'ページが見つかりませんでした... - がじぇっとぐらし！'
})
</script>

<template>
  <div>
    <TheHeader />
    <div class="container">
      <div class="notfoundWrap">
        <img src="@/assets/imgs/report_problem_black_24dp.svg" alt="" class="icon404">
        <h3>{{ error.statusCode }} Not Found</h3>
        <h2>ページが見つかりませんでした...</h2>
        <NuxtLink to="/">
          ホームに戻る
        </NuxtLink>
      </div>
    </div>
    <TheFooter />
  </div>
</template>

<style lang="scss" scoped>
.container {
  display: flex;
  justify-content: center;
  background-color: $bg-white;
}

.notfoundWrap {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  max-width: 700px;
  height: 85vh;
  text-align: center;
}

.icon404 {
  width: 30%;
}
</style>
