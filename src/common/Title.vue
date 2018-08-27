<template>
 <div id='title' class="one-bottom-px">
     <!--<span @click="clickBack()"></span>-->
     <slot></slot>
 </div>
</template>

<script>
 export default {
   name:'Title',
   data () {
     return {

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

   },
   updated(){

   },
   destroyed(){

   },
 }
</script>

<style  scoped lang='scss'>
#title{
    font-size: .28rem; 
    height: 1rem;
    text-align: center;
    line-height: 1rem;
    font-size: .34rem;
    font-weight: bold;
    background:#f9f9f9;
    position: relative;
    margin-bottom: .3rem;
    z-index: 11;
    span{
        margin-left: .3rem;
        display: block;
        // background: url(../../static/images/back.png) no-repeat center;
        background-size: .35rem .46rem;
        height: 1rem;
        width: .35rem;
        position: absolute;
    }
}
 
</style>
