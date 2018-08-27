<template>
 <div id='detail'>
   <com-loading :load='loadFlag'></com-loading>
   <com-title>电表详情</com-title>
   <div class="detail_content one-bottom-px one-top-px">
        <div class="detail_title">
          剩余电量 截止 {{timeData}}
        </div>
        <div :class="{red:kwh<200,orange:kwh>200&&kwh<=800,green:kwh>800}">
          <div class="dianlian_left">
            <div class="dianlian_content">
             <span>￥</span><span>{{ammeterObj.money}}</span>
            </div>
            <div class="dianlian_l" :style="'width:'+ ((kwh/5000)*100<100?(kwh/5000)*100:100) +'%;'"></div>
            <div class="dianlian_r"></div>
          </div>
          <div class="dianlian_right"></div>
        </div>
        <div class="detail_biaohao">{{ammeterObj.meterNo}}</div>
        <div class="detail_address">{{ammeterObj.meterAddress}}</div>
        <div class="detail_location">{{ammeterObj.meterName}}</div>
    </div>
    <div class="detail_operate">
       <ul v-show="ul_list">
         <li v-for="(item, index) in items" :key="index" 
         :class="{meterSet:index==0,meterTrend:index==1,orderRecord:index==2,Active:selectIndex==index}"
          @click.stop="changeSelectIndex(index,item.path_com)"
         >
            <div></div>
            <span>{{item.word}}</span>
          </li>
       </ul>
    </div>
    <div class="buy_btn">
      <button class="buy_ammeter" 
       v-show="btnFlag"
       @click.stop="jumpBuy(ammeterObj.meterNo,ammeterObj.meterAddress,ammeterObj.meterName)"
      >立即购电</button>
    </div>

    <router-view></router-view>
 </div>
</template>

<script>
import {loadData,getSessionData,setSessionData,removeSessionData} from '../assets/js/index';
import URL_API from '../api/index';
 export default {
   name:'Detail',
   data () {
     return {
        items:[{word:'电表设置',path_com:'/detail/meterset'},{word:'用电趋势',path_com:'/detail/metertrend'},{word:'订单记录',path_com:'/detail/orderrecord'}],
        kwh:getSessionData("kwh"),
        id:getSessionData("meterNo"),
        timeData:'',
        ammeterObj:{},
        selectIndex:0,
        btnFlag:false,
        ul_list:false,
        loadFlag:false
     }
   },
   components: {

   },
   computed: {

   },
   methods: {
     /* 解析链接地址 */
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
    jumpBuy(id,address,location){  //跳转购买
      setSessionData("meterNo",id)
      setSessionData("meterAddress",address)
      setSessionData("meterName",location)
      this.$router.push({path:'/buy'})
    },
    jumpAdd(){  //跳转添加电表
      this.$router.push({path:'/add'})
    },
    clickBack(){  //返回
      this.$router.back()
    },
    initData:function(){
      // 时间
      let myDate = new Date();
      this.timeData = myDate.getFullYear()+""+((myDate.getMonth()+1)>9?(myDate.getMonth()+1):"0"+(myDate.getMonth()+1))+""+(myDate.getDate()>9?myDate.getDate():'0'+myDate.getDate())+" "+(myDate.getHours()>9?myDate.getHours():'0'+myDate.getHours())+":"+(myDate.getMinutes()>9?myDate.getMinutes():'0'+myDate.getMinutes());
    },
    // 查询单个电表余额
    postInquiryBalance(){
      let that = this ; 
      loadData({
    		url: `${URL_API.onlineUrl.remainderMeterurl}`,
    		getMeterCallback: function(data) {
    			if(data) {
            that.loadFlag = true;
            $.extend(that.ammeterObj,data);
            setSessionData("meterName",data.meterName)
            setSessionData("meterAddress",data.meterAddress)
            data.remindThreshold==0?setSessionData("remindThreshold",""):setSessionData("remindThreshold",data.remindThreshold);
            if(data.meterType =='2'){
              $('.meterTrend').show();
              that.ul_list = true;
            }
            else{
              $('.meterTrend').hide();
              that.ul_list = true;
            }
            that.btnFlag = true;
    			}
    		},
    		data: {
          // openid: '94a7aca8944bded58b8d762d5666c586',
          openid: that.getQueryString("openid")?that.getQueryString("openid"):getSessionData('openid'),
          meterNo:that.id
    		}
    	});
    },
    changeSelectIndex(index,path,meterType){  //跳转电表设置，用电趋势，订单记录
      this.selectIndex = index;
      setSessionData('meterType',this.ammeterObj.meterType)
      this.$router.push({path:path});
    }
   },
   created(){
     this.initData();
     this.postInquiryBalance(); // 查询单个电表余额
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
@import "../assets/css/detail.scss";
 
</style>
