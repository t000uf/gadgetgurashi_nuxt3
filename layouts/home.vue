<script lang="ts" setup></script>

<template>
  <div>
    <TheHeader />
    <div id="wrap">
      <div id="top">
        <img src="@/assets/imgs/DSCF1982.jpg" alt="" id="topImg">
      </div>
      <div class="container_home">
        <div class="contents_home">
          <slot />
          <SideBar />
        </div>
      </div>
    </div>
    <NavButton />
    <TheFooter />
  </div>
</template>

<style lang="scss" scoped>
.container_home {
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

.contents_home {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  box-sizing: border-box;
  max-width: 1024px;
  width: 100%;
  margin: 10px 0;
  padding: 0;
  opacity: 0;
  animation: fadein .5s ease-out forwards;
  animation-delay: 100ms;
}

@media screen and (max-width:639px) {
  .contents_home {
    padding: 0;
    align-items: center;
  }
}

@media screen and (min-width:640px) {
  .contents_home {
    padding: 0 1% 0 1%;
    align-items: center;
    font-size: medium;
  }
}

@media screen and (min-width:1025px) {
  .contents_home {
    flex-direction: row;
    align-items: flex-start;
  }
}

@media screen and (max-width:300px) {
  .container_home {
    padding: 0 1px 0 1px;
  }
}

#wrap {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  height: 100%;
}

#top {
  position: sticky;
  top: 52px;
  width: 100%;
  height: max-content;
  z-index: -999;
  box-sizing: border-box;
}

#top img {
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  object-fit: cover;
  object-position: 50% 50%;
}

.sentence h4 {
  margin-top: 0;
}

@media screen and (min-width:640px) {
  #top {
    height: 40vh;
  }
}

@media screen and (min-width:760px) {
  #top {
    height: 50vh;
  }
}
</style>

<style lang="scss" scoped>
.contents {
  margin-top: 30px;
}
</style>
