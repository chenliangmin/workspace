<template>
 <div id="order" class="pages">
    <com-loading :load='loadFlag'></com-loading>
    <com-header></com-header>
    <div class="order_wrapper">
      <ul class="order_ul">
        <li class="order_li one-bottom-px one-top-px"
         v-for="(item,index) in orderArr" :key='index'
          @click="jumpPay(item.meterNo,item.payOrderNo,item.meterAddress,item.meterName)"
        >
          <div class="order_bianhao">
              <span class="meter_number">
                  {{item.meterNo}}
              </span>
              <span :class="{red:item.status=='0',orange:item.status=='1',green:item.status=='2',gray:item.status=='4'}">
                  {{item.statusDesc}}
              </span>
          </div>
          <div class="order_address">
              {{item.meterAddress}}
          </div>
          <div class="order_location">
              {{item.meterName}}
          </div>
          <div class="order_code" v-show="item.token">
              购电码 {{item.token}}
          </div>
          <div class="order_foot">
              <span class="order_time">
                  {{item.time}}
              </span>
              <span class="order_number">
                  订单金额： ￥{{item.recharge}}
              </span>
          </div>
        </li>
      </ul>
    </div>
 </div>
</template>

<script>
import {loadData,setSessionData,getSessionData,removeSessionData} from "../assets/js/index" 
import URL_API from '../api/index'
 export default {
   name:'Order',
   data () {
     return {
         codeFlag:false,
         orderArr:[],
         loadFlag:false
     }
   },
   components: {

   },
   computed: {

   },
   methods: {
       // 解析地址
    getQueryString: function(name) {
        var currentSearch = decodeURIComponent(location.search.slice(1));
        if (currentSearch != '') {
            var paras = currentSearch.split('&');
            for (var i = 0, l = paras.length, items; i < l; i++) {
                var sindex = paras[i].search("=");
                var tname = paras[i].substring(0, sindex);
                var tval = paras[i].substring(sindex + 1, paras[i].length);
                if (tname === name) {
                    return tval;
                }
            }
            return '';
        }
        return '';
    },
    // post查询订单列表
    orderList(){
      let that = this ; 
      loadData({
    		url: `${URL_API.onlineUrl.orderListUrl}`,
    		orderlistCallback: function(data) {
    			if(data && data.code == 0) {
                    that.loadFlag = true
                    for (let index = 0; index < data.content.length; index++) {
                        that.orderArr.push(data.content[index]);     
                    }
    			}
    		},
    		data: {
                // openid: '94a7aca8944bded58b8d762d5666c586'
                openid: that.getQueryString("openid")?that.getQueryString("openid"):getSessionData('openid')
    		}
      })

    },
    jumpPay(meterNo,orderNo,address,location){
      setSessionData('waitFlag',false);
      setSessionData("orderNo",orderNo);
      this.$router.push({path:'/pay'});
    }
   },
   created(){

   },
   mounted(){
    this.orderList();//查询订单列表
    this.orderScroll = new IScroll(".order_wrapper",{
      probeType: 3,
      mouseWheel: true, 
      click: true,
      tap: true
    });
   },
   updated(){
       this.orderScroll.refresh();
   },
   destroyed(){

   },
 }
</script>

<style  scoped lang='scss'>
@import "../assets/css/order.scss";
 
</style>


