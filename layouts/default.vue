<script lang="ts" setup></script>

<template>
  <div>
    <Header />
    <div class="container">
      <div class="contents">
        <slot />
        <Side />
      </div>
    </div>
    <NavButton />
    <Footer />
  </div>
</template>

<style lang="scss" scoped>
.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 0;
  background-color: $bg-white;
  box-sizing: border-box;
}

.contents {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  box-sizing: border-box;
  max-width: 1024px;
  width: 100%;
  margin: 70px 0;
  padding: 0;
  opacity: 0;
  animation: fadein .5s ease-out forwards;
  animation-delay: 100ms;
}

.sentence {
  max-width: 700px;
  width: 100%;
  padding: 10px;
  box-sizing: border-box;
}

@media screen and (max-width:639px) {
  .contents {
    padding: 0;
    align-items: center;
  }
}

@media screen and (min-width:640px) {
  .contents {
    padding: 0 1% 0 1%;
    align-items: center;
    font-size: medium;
  }
}

@media screen and (min-width:1025px) {
  .contents {
    flex-direction: row;
    align-items: flex-start;
  }
}

@media screen and (max-width:300px) {
  .container {
    padding: 0 1px 0 1px;
  }

  .sentence {
    padding: 0 5px 0 5px;
  }
}
</style>
