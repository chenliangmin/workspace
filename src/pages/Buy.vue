<template>
 <div id='buy' class="pages">
     <com-title>充值</com-title>
     <div class='iscroll_buy'>
      <div class="wrapper">
        <div class="buyerInfo">
          <div class="eneryCard">{{eneryCard}}</div>
          <div class="buyer_address">{{address}}</div>
          <div class="buyer_location">{{location}}</div>
        </div>
        <div class="monetary">
          <div class="monetary_title">购买金额</div>
          <ul> 
            <li v-for="(item,index) in rechargeArr" :key="item.id" 
             :class="{liActive:index==ActiveIndex}"
             @click="addClassIndex(index)">
                {{item}}
            </li>
            <input type="tel" name="inputMoney" id="inputMoney" 
             placeholder="请输入购买金额（不超过5000元）" 
             v-show="condition" v-model="amount"
             onfocus="this.placeholder=''" onblur="this.placeholder='请输入购买金额（不超过5000元）'"/>
          </ul>
        </div>
        <div class="buy_intro">
          <p>购买充值卡后您将获得购买凭证码，通过购买凭证码可在电表上缴纳电费</p>
          <button @click="buyMeter()">提交订单</button>
        </div>
      </div>
    </div>
 </div>
</template>

<script>
import {loadData,getSessionData,setSessionData} from '../assets/js/index';
import URL_API from '../api/index';
 export default {
   name:'Buy',
   data () {
     return {
        eneryCard:getSessionData("meterNo"),
        address:getSessionData("meterAddress"),
        location:getSessionData("meterName"),
        rechargeArr:['100','200','500','1000','其他金额'],
        condition:false,
        ActiveIndex:0,
        buyScroll:'',
        amount:'',
        rechargeAmount:'100'
     }
   },
   components: {

   },
   computed: {

   },
   methods: {
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
    changeCond(){
      this.condition = true;
      this.ActiveIndex = 4;
    },
    addClassIndex(index){
      if(index==4){
        this.condition = true;
      }
      else{
        this.condition = false;
      }
      this.ActiveIndex = index;
    },
    clickBack(){
      this.$router.back();
    },
    // 用户购电
    buyMeter(){

      if(this.condition){
        this.rechargeAmount = this.amount;
      }
      else{
        this.rechargeAmount = this.rechargeArr[this.ActiveIndex];
      }
      setSessionData("waitFlag",true)
      let that = this;
      loadData({
        url: `${URL_API.onlineUrl.buyMeterUrl}`,
        buyCallback: function(data) {
          if(data&&data.code == 0) {
            setSessionData('orderNo',data.content.colourSn);
            setSessionData('openid',that.getQueryString("openid")?that.getQueryString("openid"):getSessionData('openid'));
            //调支付控件
            if(/(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent)){
              ios(data.content.colourSn,data.content.payCallbackUrl)
            }
            else{
              android(data.content.colourSn,data.content.payCallbackUrl)
            }
          }
          // ios
          // function ios(sn,url){
          //  var url="*payFromHtml5*"+sn+"*"+url;
          //  location.href=url;
          // }    
          // ios如错误
          function ios(sn,url){
            loadURL("*payFromHtml5*"+sn+"*"+url);
          }
          function loadURL(url) {
            var iFrame;
            iFrame = document.createElement("iframe");
            iFrame.setAttribute("src", url);
            iFrame.setAttribute("style", "display:none;");
            iFrame.setAttribute("height", "0px");
            iFrame.setAttribute("width", "0px");
            iFrame.setAttribute("frameborder", "0");
            document.body.appendChild(iFrame);
            // 发起请求后这个iFrame就没用了，所以把它从dom上移除掉
            iFrame.parentNode.removeChild(iFrame);
            iFrame = null;
          }
          
          // android
          function android(sn,url){
            jsObject.payFromHtml(sn,url);
          }

        },
        data: {
          // openid: '94a7aca8944bded58b8d762d5666c586',
          openid: that.getQueryString("openid")?that.getQueryString("openid"):getSessionData('openid'),
          meterNo:that.eneryCard,
          rechargeAmount:that.rechargeAmount,
        }
      })

      
       
    }
   },
   created(){
       
   },
   mounted(){
       this.buyScroll = new IScroll(".iscroll_buy",{
            probeType: 3,
            mouseWheel: true, 
            click: true,
            tap: true
       })
       setTimeout(() => {
          this.buyScroll.refresh();
       }, 300);
   },
   updated(){
      
   },
   destroyed(){

   },
 }
</script>

<style  scoped lang='scss'>
  @import "../assets/css/buy.scss";  
 
</style>
