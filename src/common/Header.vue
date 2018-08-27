<template>
  <nav class="tabs one-bottom-px">
    <router-link 
      class="tab" 
      v-for="tabItem in tabsData" :key="tabItem.id" 
      :to="tabItem.path"
    >
      <span class="text">{{tabItem.title}}</span>
    </router-link>
  </nav>
</template>

<script>
export default {
  name: 'Header',
  data(){
	return {
      tabsData: [
        {title: '我的电表', path: '/ammeter'},
        {title: '我的订单', path: '/order'},
    ]
	}
  },

}
</script>

<style scoped lang='scss'>
  @import "../assets/css/header.scss";
</style>