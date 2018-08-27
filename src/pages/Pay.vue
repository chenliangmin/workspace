<template>
 <div id='pay' class="pages">
     <com-loading :load="loadFlag"></com-loading>
     <com-title>支付</com-title>
     <div class="pay_wrapper">
      <div class="pay_wait" v-if="waitFlag">
          <div class="wait_icon"></div>
          <div class="wait_content">正在购电中，请稍候...</div>
      </div>
      <div class="pay_completion" v-else>
        <div :class="{pay_waiting:code=='0',pay_sucess:code =='1',pay_erro:code =='2',pay_close:code =='4',pay_buyele:code =='5'}"></div>
        <div class="pay_code"v-show="code=='1'">
            <span class="code_left">购电码&nbsp;&nbsp;&nbsp;&nbsp;</span><span class="code_right">{{codeNumber}}</span>
        </div>
        <ul class="pay_ul">
          <li class="li_title"><span class="title_identification">
              </span><span class="title_info">订单详情</span>
          </li>
          <li class="li_content">
              <span class="content_left">订单号：</span><span class="content_right">{{orderNo}}</span>
          </li>
          <li class="li_content">
              <span class="content_left">电表卡号：</span><span class="content_right">{{meterNumber}}</span>
          </li>
          <li class="li_content">
              <span class="content_left">签约人：</span><span class="content_right">{{signatory}}</span>
          </li>
          <li class="li_content">
              <span class="content_left">下单时间：</span><span class="content_right">{{orderTime}}</span>
          </li>
          <li class="li_content">
              <span class="content_left">订单总额：</span><span class="content_right">{{oderAmount}} 元</span>
          </li>
          <li class="li_content">
              <span class="content_left">红包抵扣：</span><span class="content_right">{{deduction}} 元</span>
          </li>
          <li class="li_content">
              <span class="content_left">实付金额：</span><span class="content_right">{{payAmount}} 元</span>
          </li>
        </ul>
        <div v-show="code=='2'" class="prompt"><p>请及时联系小区管理员</p><p>或者致电<span>400-889-3893</span>处理</p></div>
        <div class="confirm">
          <button v-show="code=='0'" @click="jumpRePay()">继续支付</button>
          <button v-show="code=='1'" @click="jumpOrder()">已完成</button>
          <button v-show="code=='2'" @click="jumpOrder()">查看更多订单</button>
          <button v-show="code=='4'" @click="jumpBuy()">重新购电</button> 
          <button v-show="code=='5'" @click="jumpOrder()">查看更多订单</button>
        </div>
      </div>
    </div>
 </div>
</template>

<script>
import {loadData,getSessionData,setSessionData,removeSessionData} from '../assets/js/index';
import URL_API from '../api/index';
 export default {
   name:'Pay',
   data () {
     return {
      waitFlag:getSessionData("waitFlag")==='true'?true:false,
      codeNumber:'',
      orderNumber:'',
      orderNo:'',
      meterNumber:'',
      signatory:'',
      meterAddress:'',
      orderTime:'',
      payCallbackUrl:'',
      oderAmount:'',
      deduction:'0.00', //红包抵扣
      payAmount:'',
      code : '',
      backFlag:true,
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

    //获取支付结果
    payResult(){
      let that = this ;
      if(that.waitFlag){
        let timer = setTimeout(()=>loadData({
          url: `${URL_API.onlineUrl.payUrl}`,
          getOrderCallback: function(data) {
            
            if(data&&data.code == 0) {
              that.waitFlag = false;
              setSessionData("waitFlag",false);
              that.code = data.content.status;
              that.codeNumber = data.content.token;
              that.orderNumber = data.content.payOrderNo;
              that.orderNo = data.content.orderNo;
              that.meterNumber = data.content.meterNo;
              that.meterAddress = data.content.meterAddress;
              that.signatory = data.content.meterName;
              that.orderTime = data.content.time;
              that.payCallbackUrl = data.content.payCallbackUrl;
              that.oderAmount = data.content.recharge;
              that.payAmount =  data.content.status == '1'||data.content.status == '2'?data.content.recharge:'0.00';
            }
          },
          data: {

            // openid: '94a7aca8944bded58b8d762d5666c586',
            openid: that.getQueryString("openid")?that.getQueryString("openid"):getSessionData('openid'),
            orderNo:getSessionData("orderNo")
          }
        }),3000);
      } 
      else{
        loadData({
          url: `${URL_API.onlineUrl.payUrl}`,
          getOrderCallback: function(data) {
            
            if(data&&data.code == 0) {
              that.loadFlag = true;
              that.waitFlag = false;
              setSessionData("waitFlag",false);
              that.code = data.content.status;
              that.codeNumber = data.content.token;
              that.orderNumber = data.content.payOrderNo;
              that.orderNo = data.content.orderNo;
              that.meterNumber = data.content.meterNo;
              that.signatory = data.content.meterName;
              that.meterAddress = data.content.meterAddress;
              that.orderTime = data.content.time;
              that.payCallbackUrl = data.content.payCallbackUrl;
              that.oderAmount = data.content.recharge;
              that.payAmount =  data.content.status == '1'||data.content.status == '2'?data.content.recharge:'0.00';
            }
          },
          data: {
            // openid: '94a7aca8944bded58b8d762d5666c586',
            openid: that.getQueryString("openid")?that.getQueryString("openid"):getSessionData('openid'),
            orderNo:getSessionData("orderNo")
          }
        })
      }
      
    },
    jumpBuy(){
      setSessionData('meterAddress',this.meterAddress);
      setSessionData('meterName',this.signatory);
      setSessionData('meterNo',this.meterNumber);
      this.$router.push({path:'/buy'});
      removeSessionData("backFlag")
    },
    jumpOrder(){
      this.$router.push({path:'/order'})
      removeSessionData("backFlag")
    },
    initData:function(){

    },
    clickBack(){
      if(this.backFlag){
        this.$router.push({path:'/order'}); //重新支付返回，直接返回订单页面
      } else{
        this.$router.back();
      }
      removeSessionData("backFlag")
    },
    jumpRePay(){  //重新支付
       //调支付控件
      this.$router.replace({path:'/order'}); //返回到order,将原先history替换掉
      setSessionData("backFlag",true)
      let that = this;
      that.rePayFlag = false;
      setSessionData("waitFlag",true)
      if(/(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent)){
        ios(that.orderNumber,that.payCallbackUrl)
      }
      else{
        android(that.orderNumber,that.payCallbackUrl)
      }
      // ios
      // function ios(sn,url){
      //   var url="*payFromHtml5*"+sn+"*"+url;
      //   location.href=url;
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
    }
   },
   created(){
        this.payResult();
        this.initData();
   },
   mounted(){
       this.payScroll = new IScroll('.pay_wrapper',{
           probeType:3,
           mouseWheel:true,
           click:true,
           tap:true
       })
   },
   updated(){
       this.payScroll.refresh()
   },
   destroyed(){

   },
 }
</script>

<style  scoped lang='scss'>
@import '../assets/css/pay';
 
</style>
