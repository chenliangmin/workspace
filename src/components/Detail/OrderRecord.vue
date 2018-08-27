<template>
  <div id="orderrecord"  class="subpage">
    <com-routetitle>订单记录</com-routetitle>
    <div class="iscroll_bg"></div>
    <div class="orderrecord_info">
      <div class="orderrecord_biaohao">{{meterNo}}</div>
      <div class="orderrecord_address">{{meterAddress}}</div>
      <div class="orderrecord_location">{{meterName}}</div>
    </div>
    <div class="orderrecord_result">
      <div class="orderrecord_wrapper">
        <ul>
          <li v-for="(item, index) in orderrecordArr" :key="index" :class="{orderrecord_sucess:item.status==1,orderrecord_error:item.status==2}">
            <div class="orderrecord_time">{{item.time}}</div>
            <div>
              <div class="orderrecord_price">{{item.recharge}}</div>
              <div class="orderrecord_words"><span></span>{{item.statusDesc}}</div>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>

</template>

<script>
import {loadData,getSessionData,setSessionData,removeSessionData} from "../../assets/js/index" 
import URL_API from '../../api/index'
export default {
  name: 'OrderRecord',
  data(){
		return {
      meterNo:getSessionData("meterNo"),
      meterAddress:getSessionData("meterAddress"),
      meterName:getSessionData("meterName"),
      eleRemind:getSessionData("remindThreshold"),
      orderrecordArr:[],
		}
  },
  methods:{
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
    clickBack(){
      this.$router.back()
    },
    initData:function(){
      let that = this ; 
      loadData({
    		url: `${URL_API.onlineUrl.orderListUrl}`,
    		orderlistCallback: function(data) {
    			if(data && data.code == 0) {
            let arr = data.content;
            for(let i=0;i<arr.length;i++){
              if(arr[i].status == 1 ||arr[i].status == 2){
                that.orderrecordArr.push(arr[i])
              }
            }
          }
    		},
    		data: {
          // openid: '94a7aca8944bded58b8d762d5666c586',
          openid: that.getQueryString("openid")?that.getQueryString("openid"):getSessionData('openid'),
          meterNo:getSessionData("meterNo"),
    		}
    	})
    }
  },
  created(){
    this.initData()  //获取单个电表的订单数据
  },
  mounted(){
    this.orderrecordScroll = new IScroll(".orderrecord_result",{
      probeType: 3,
      mouseWheel: true, 
      click: true,
      tap: true
    });
  },
  updated(){
    this.orderrecordScroll.refresh();
  }


}
</script>

<style scoped lang='scss'>
@import "../../assets/css/detail/orderrecord.scss";
</style>