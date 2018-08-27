<template>
 <div id='noOpenid' v-show="openidFlag">
     <p>未获取到您的openid，请联系客服处理</p>
 </div>
</template>

<script>
import Store from '../../store/index';
 export default {
   name:'Noopenid',
   data () {
     return {
        openidFlag:false
     }
   },
   components: {

   },
   computed: {

   },
   methods: {

   },
   created(){

   },
   mounted(){
        let that = this;
       Store.$on('openidFlag',(e)=>{
           that.openidFlag = e;
       })
   },
   updated(){

   },
   destroyed(){

   },
 }
</script>

<style lang='scss' scoped>
#noOpenid{
    position:fixed;
    top:0;
    bottom:0;
    left:0;
    right: 0;
    background: #f3f3f3;
    z-index: 20;
    p{
        display: block;
        width: 100%;
        position: absolute;
        text-align: center;   
        top: 50%;
        font-size: .34rem;
        transform: translateY(-50%);
        -webkit-transform: translateY(-50%);
    }
}
 
</style>
