<template>
 <div id='noBind' v-show="bindFlag">
      <div class="header one-bottom-px">
          我的电表
      </div>
      <div class="noBindBg"></div>
      <div class="noBindWords">
          <p>想知道电表剩余电量？</p>
          <p>马上绑定电表</p>
      </div>
      <div class="add_btn">
          <button @click="jumpAdd()">
              绑定电表
          </button>
      </div>
 </div>
</template>

<script>
import Store from '../../store/index';
 export default {
   name:'Nobind',
   data () {
     return {
        bindFlag:false
     }
   },
   components: {

   },
   computed: {

   },
   methods: {
       jumpAdd(){  //跳转绑定电表

       }
   },
   created(){

   },
   mounted(){
       let that = this;
       Store.$on('bindFlag',(e)=>{
           that.bindFlag = e;
       })
   },
   updated(){

   },
   destroyed(){

   },
 }
</script>

<style  scoped lang='scss'>
#noBind{
    position:fixed;
    top:0;
    bottom:0;
    left:0;
    right: 0;
    background: #f3f3f3;
    z-index: 19;
    .header{
        background: #f9f9f9;
        height: 1rem;
        line-height: 1rem;
        text-align: center;
        color: #4c7bfd;
        font-size: .34rem;
        font-weight: bold;
    }  
    .noBindBg{
        width: 100%;
        height: 3.33rem;
        // background: url(../../../static/images/no_data_bg.png) no-repeat center 1.04rem;
        background-size: 2.42rem 1.88rem;
    }
    .noBindWords{
        p{
            text-align: center;
            color: #4c7bfd;
            font-size: .34rem;
            font-weight: bold;
            line-height: .5rem;
        }
    }
    .add_btn{
        padding: 0 .4rem;
        button{
            margin-top: 1.55rem;
            border: 0;
            background: #0497ff;
            height: 1.12rem;
            width: 100%;
            font-size: .34rem;
            color: #fff;
            border-radius: .16rem;
            outline: none;
        }
    }
}
 
</style>
