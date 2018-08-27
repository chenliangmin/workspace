<template>
 <div id='ammeter'>
     <com-noopenid></com-noopenid>
     <com-nobind></com-nobind>
     <com-content></com-content>
     
 </div>
</template>

<script>
    import Nobind from '../components/Ammeter/Nobind';
    import Noopenid from '../components/Ammeter/Noopenid';
    import Content from '../components/Ammeter/Content';

    import {loadData,setSessionData,getSessionData,removeSessionData} from "../assets/js/index" 
    import URL_API from '../api/index'
    import Store from '../store/index';
    
 export default {
   name:'Ammeter',
   data () {
     return {

     }
   },
   components:{
       'com-nobind':Nobind,  //未绑定电表组件
       'com-noopenid':Noopenid,  //未获取到openid组件
       'com-content':Content  //有电表数据组件
   },
   computed: {

   },
   methods: {
   
   },
   created(){

   },
   mounted(){

   }
 }
</script>

<style  scoped lang='scss'>

</style>



