<script lang="ts" setup>
import type { MicroCMSListContent } from 'microcms-js-sdk'
import type { Tag } from '@/types'

const props = defineProps<{
  pager: number[]
  current: number
  tag?: MicroCMSListContent & Tag
}>()

const getPath = (p: number) => {
  return `/${props.tag ? `tag/${props.tag.id}/` : ''}page/${p}/`
}
</script>

<template>
  <div class="pagingWrap">
    <ul class="pager">
      <li v-if="2 < current" class="page">
        <NuxtLink :to="getPath(1)" />
        <p>1</p>
      </li>
      <li v-if="3 <= current" class="omission">
        ...
      </li>
      <li v-for="p in pager" v-show="current - 2 <= p && p <= current + 0" :key="p" class="page"
        :class="{ active: current === p + 1 }">
        <NuxtLink :to="getPath(p + 1)" />
        <p>{{ p + 1 }}</p>
      </li>
      <li v-if="current + 2 <= pager.length" class="omission">
        ...
      </li>
      <li v-if="current + 1 < pager.length" class="page">
        <NuxtLink :to="getPath(pager.length)" />
        <p>{{ pager.length }}</p>
      </li>
    </ul>
    <ul class="pageArrows">
      <li v-if="1 < current" class="page arrow">
        <img src="@/assets/imgs/arrow_back_ios_new_black_24dp.svg" alt="前のページへ">
        <NuxtLink :to="getPath(current - 1)" />
      </li>
      <li v-if="current < pager.length" class="page arrow">
        <img src="@/assets/imgs/arrow_forward_ios_black_24dp.svg" alt="次のページへ">
        <NuxtLink :to="getPath(current + 1)" />
      </li>
    </ul>
  </div>
</template>

<style lang="scss" scoped>
.pagingWrap {
  width: 100%;
}

.pager {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  margin: 0;
  padding: 0;
  height: 70px;
}

.page {
  position: relative;
  box-sizing: border-box;
  border-radius: 50px;
  margin: 0 10px;
  padding: 10px;
  width: 45px;
  height: 45px;
  background-color: $sub-color;
  text-align: center;
  list-style-type: none;

  a {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }

  p {
    margin: 0;
    font-size: 110%;
  }
}

.omission {
  text-align: center;
  list-style-type: none;
}

.active {
  background-color: $main-color;
}

.pageArrows {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  margin: 0;
  padding: 0;
  height: 70px;
}

.arrow {
  background-color: $main-color;

  img {
    position: absolute;
    top: 11px;
    left: 11px;
  }
}

@media screen and (max-width: 400px) {
  .page {
    margin: 0 4px;
    padding: 7px;
    width: 40px;
    height: 40px;

    p {
      font-size: 100%;
    }
  }

  .arrow img {
    top: 9px;
    left: 8px;
  }
}
</style>
