<template>
	<div id="header">
    <header>
      <div class="headerContents">
        <div id="logo">
          <nuxt-link to="/"></nuxt-link>
          <img src="@/assets/imgs/gadget_life_gray.png" alt="gadget_life_logo" id="headerPic">
        </div>
        <div id="menu">
          <ul>
            <li><nuxt-link to="/">home</nuxt-link></li>
            <li><nuxt-link to="/article/about">about</nuxt-link></li>
          </ul>
        </div>
      </div>
    </header>
  </div>
</template>

<style lang="scss">

header{
  position: fixed;
  top: 0;
  left: 0;
  display: flex;
  justify-content: center;
  width: 100%;
  height: 50px;
  background-color: #faf9f8aa;
  backdrop-filter: blur(10px);
  border-bottom: $main-color solid 5px;
  z-index: 999;
}

.headerContents{
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  max-width: 1280px;
  width: 100%;
  height: 100%;
  
}

#logo{
  position: relative;
  box-sizing: border-box;
  height: 100%;
  padding: 5px;
}

#logo a{
  position: absolute;
  width: 100%;
  height: 100%;
}

#headerPic {
  height: 100%;
}

#menu ul{
  display: flex;
  flex-direction: row;
}

#menu ul li{
  margin-right: 20px;
  font-size: 18px;
  list-style-type: none;
}

#menu ul li a{
  position: relative;
  text-decoration: none;
  color: $text-color;
  transition-duration: 0.3s;
  -webkit-transition-duration: 0.3s;
}

#menu ul li a:hover{
  color: $text-color;
}

#menu ul li a::after{
  position: relative;
  left: 0;
  bottom: 0;
  display: block;
  content: "";
  width: 0;
  height: 2px;
  background: rgb(56, 56, 56);
  opacity: 0;
  transition-duration: 0.3s;
  -webkit-transition-duration: 0.3s;
}

#menu ul li a:hover::after{
  left: 0;
  bottom: 0;
  width: 100%;
  opacity: 100;
}

@media screen and (max-width:639px) {
  #menu{
    display: none;
  }
}

</style>