<template>
  <footer class="foot">
    <nuxt-link to="#">page top</nuxt-link>
      <div class="footnav">
        <ul>
          <li><nuxt-link to="/">home</nuxt-link></li>
          <li><nuxt-link to="/article/about">about</nuxt-link></li>
        </ul>
      </div>
    <small>© 2022 gadgetgurashi</small>
  </footer>
</template>

<style lang="scss" scoped>

.foot{
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 20px;
  padding-bottom: 20px;
  background-color: $bg-gray;
}

.foot a{
  margin: 0 10px;
  color: $text-color;
}

.footnav {
  display: flex;
  justify-content: center;
  align-items: center;
}

.footnav ul {
  padding-left: 0;
}

.footnav ul li {
  display: inline-block;
}

.footnav ul li a{
  color: $text-color;
}

</style>