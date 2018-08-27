<template>
 <div id='loading' :class="{move:load}">
    <div class="loading_content">
      <img src="../../static/images/loading.gif" />
      <p>正在加载中...</p>
    </div>
 </div>
</template>

<script>
 export default {
   name:'Loading',
   data () {
     return {

     }
   },
   props:["load"],
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
#loading{
    position: fixed;
    z-index: 20;
    width: 100%;
    top: 0;
    bottom: 0;
    // background:#fff url(../../static/images/loading.gif) no-repeat center;
    // background-size: 3.5rem 2.8rem;
    background: #fff;
    opacity: 1;
    -webkit-transition: all .5s ease-in;
    -moz-transition: all .5s ease-in;
    transition: all .5s ease-in;

}
.loading_content{
  position:fixed;
  left:50%;
  top:50%;
  transform: translate(-50%,-50%);
}
#loading img{
  display:block;
  width:3.5rem;
  height:2.8rem;
}
#loading p{
  text-align: center;
  margin-top: .5rem;

}
#loading.move{
  opacity: 0;
  z-index: -1;
}
 
</style>
