<script lang="ts" setup>
const { returnTop } = useScrollTop()

const buttonActive = ref(true)

const scrollWindow = () => {
  const bottom = document.documentElement.scrollHeight - 1000
  buttonActive.value = window.scrollY <= bottom
}

onMounted(() => {
  window.addEventListener('scroll', scrollWindow)
})

onUnmounted(() => {
  window.removeEventListener('scroll', scrollWindow)
})
</script>

<template>
  <div v-show="buttonActive" class="nav-button">
    <div class="icon" id="homeButton">
      <NuxtLink to="/" />
      <img src="@/assets/imgs/home_black_24dp.svg" alt="home">
      <p>home</p>
    </div>
    <div class="icon" id="topButton" @click="returnTop">
      <img src="@/assets/imgs/upgrade_black_24dp.svg" alt="top">
      <p>top</p>
    </div>
  </div>
</template>

<style lang="scss">
.nav-button {
  position: fixed;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  align-items: flex-end;
  width: max-content;
  z-index: 999;
  background-color: #faf9f8aa;
  backdrop-filter: blur(5px);
}

.icon {
  display: flex;
  position: relative;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 65px;
  height: 65px;
  font-size: small;
}

.icon a {
  display: block;
  position: absolute;
  width: 100%;
  height: 100%;
  color: #474747;
  text-decoration: none;
}

.icon p {
  margin: 0;
}

@media screen and (max-width:639px) {
  .nav-button {
    right: 0px;
    bottom: 100px;
    height: 120px;
    box-shadow: $bg-gray -2px 1px 3px;
    border-radius: 10px 0 0 10px;
  }
}

@media screen and (min-width:640px) {
  .nav-button {
    right: 5vw;
    bottom: 10vh;
    height: 65px;
    box-shadow: $bg-gray -2px 1px 3px;
    border-radius: 50px;
  }

  #homeButton {
    display: none;
  }
}
</style>
