<script lang="ts" setup></script>
twitter-follow-button.value = '';
<template>
  <div class="side">
    <!--<a href="https://twitter.com/share?ref_src=twsrc%5Etfw" class="twitter-share-button" data-size="large" data-lang="ja" data-show-count="true">Tweet</a><script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>
    <a href="https://twitter.com/gadgetgurashi?ref_src=twsrc%5Etfw" class="twitter-follow-button" data-size="large" data-lang="ja" data-show-count="false">Follow @gadgetgurashi</a><script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>-->
    <adsbygoogle 
     :ad-slot="'7173714878'" 
     :ad-format="'auto'"
     :ad-style="{ display: 'block' }"
     />
  </div>
</template>

<style lang="scss" scoped>

@media screen and (min-width:1025px) {
  
  .side{
    position: sticky;
    top: 90px;
    width: 250px;
    height: 85vh;
    box-sizing: border-box;
    border-radius: 10px;
    margin: 30px 0;
    padding: 10px;
    background-color: $bg-lightgray;
  }
}

</style>