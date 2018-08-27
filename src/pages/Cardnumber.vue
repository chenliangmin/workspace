<template>
 <div id='cardnumber'>
     <com-title>电表卡号</com-title>
     <ul>
      <li v-for="item in pageArr" :key="item.id">
          <p>{{item}}</p>
      </li>
    </ul>
 </div>
</template>

<script>
 export default {
   name:'Cardnumber',
   data () {
     return {
         pageArr:["如何查找电表卡？","1.可以查询合同中购电协议中的您家中的电表获取卡号信息。","2.可以直接查看电表，电表会标明电表卡号。"],
     }
   },
   components: {

   },
   computed: {

   },
   methods: {
       clickBack(){
           this.$router.back()
       }
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
#cardnumber ul li p{
    padding:0 .46rem;
    line-height:.6rem;
    font-size:.28rem;
  }
 
</style>
