<template>
 <div id='add'>
    <com-loading :load='loadFlag'></com-loading>
    <com-title>添加电表</com-title>
    <div class="add_content">
      <div class="content_list">
        <div class="line_bottom">
            <label>电表卡号：</label><input type="tel"
             id="cardNumber" 
             name="cardNumber" 
             v-model="cardNumber" 
             placeholder="请输入电表卡号" 
             onfocus="this.placeholder=''" 
             onblur="this.placeholder='请输入电表卡号'"
              @click="alertAction()"
            />
        </div>
        <div class="phone">
            <label>手机号码：</label><input type="tel" 
             id="phoneNumber" 
             name="phoneNumberNumber"
             v-model="phoneNumber" 
             placeholder="请输入开户手机号" 
             onfocus="this.placeholder=''" 
             onblur="this.placeholder='请输入开户手机号'" 
             @click="alertAction()"
            />
        </div>
      </div>
      <div class="question" v-show="checkMeterFlag">
          <span @click="jumpCardNumner()">电表卡号？</span>
      </div>
      <div class="content_alert" v-show="alertFlag">{{alertContent}}</div>
      <div class="content_list tep">
       <div class="line_bottom" v-show="checkFlag">
           <label>小区名称：</label>
           <input type="text" 
            id="compoundName" 
            name="compoundName" 
            v-model="compoundName"  
            readonly
           />
       </div>
       <div class="line_bottom" v-show="checkFlag">
           <label>门牌号：</label><input type="text" 
             id="houseNumber" 
             name="houseNumber"
             v-model="houseNumber" 
             readonly/>
       </div>
       <div class="remind" v-show="checkFlag&&type=='2'">
           <label>电量提醒设置(度):</label><input type="tel"
           id="eleRemind" 
           name="eleRemind"
           v-model="eleRemind" 
           placeholder="请输入度数（不低于50°）" 
           onfocus="this.placeholder=''" 
           onblur="this.placeholder='请输入度数（不低于0°）'"
           @click="errorActon()"
           />
       </div>
      </div>
      <div class="errorTips" v-show="errorFlag">
          <p>电量提醒设置度数需填写不低于0°的整值</p>
      </div>
      <div class="confirm">
        <button @click="checkMeter()" v-if="checkMeterFlag">查找电表</button>
        <button @click="bindCheck()" v-else>确定</button>
      </div>
    </div>
 </div>
</template>

<script>
import {loadData,setSessionData,getSessionData,removeSessionData} from "../assets/js/index" 
import URL_API from '../api/index'
 export default {
   name:'Add',
   data () {
     return {
        cardNumber:getSessionData('cardNumber')?getSessionData('cardNumber'):'', 
        phoneNumber:getSessionData('phoneNumber')?getSessionData('phoneNumber'):'',
        eleRemind:getSessionData('eleRemind')?getSessionData('eleRemind'):'',

        checkFlag:false,
        alertFlag:false,
        alertContent:'',
        area:'',
        compoundName:'',
        houseNumber:'',
        type:'',
        checkMeterFlag:true,
        errorFlag:false,
        loadFlag:true
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
    jumpCardNumner(){ //进入电表卡号
      this.$router.push({
        path:'cardnumber'
      });
      setSessionData('cardNumber',this.cardNumber);
      setSessionData('phoneNumber',this.phoneNumber);
    },
    alertAction(){  // 隐藏提示
      this.alertFlag = false;
    },
    errorActon(){  // 点击隐藏低于50°提示
      this.errorFlag = false;
    },
    clickBack(){  // 返回
      this.$router.back();
    },
    checkMeter(){
      let that = this;
      that.loadFlag = false
      loadData({
    		url: `${URL_API.onlineUrl.checkMeterurl}`, // 查询电表
    		checkMeterCallback: function(data) {  
    			if(data && data.code == 0) {
            that.loadFlag = true;
            that.checkFlag = true;
            that.compoundName = data.content.meterAddress;
            that.houseNumber = data.content.meterName;
            that.type = data.content.meterType;
            that.checkMeterFlag = false;
    			}
          else{
            that.alertFlag = true;
            if(data.message==="请求参数缺失或不合法"){
              that.alertContent = '请检查电表卡号和手机号是否输入'
            }else{
              that.alertContent = data.message;
            }
          }
    		},
    		data: {
          meterNo:that.cardNumber,
          phone:that.phoneNumber,
          // openid: '94a7aca8944bded58b8d762d5666c586',
          openid: that.getQueryString("openid")?that.getQueryString("openid"):getSessionData('openid')
    		}
      })
    },
    // 绑定电表
    bindCheck(){
      let that = this;
      if(/^\d+$/.test(that.eleRemind)||!that.eleRemind){
        loadData({
          url: `${URL_API.onlineUrl.bindingMeterurl}`,
          bindMeterCallback: function(data) {
            if(data.code == 0) {
              that.$router.push({path:'/ammeter'}); //返回我的电表
            }
          },
          data: {
            meterNo:that.cardNumber,
            phone:that.phoneNumber,
            // openid: '94a7aca8944bded58b8d762d5666c586',
            openid: that.getQueryString("openid")?that.getQueryString("openid"):getSessionData('openid'),
            remindThreshold:that.eleRemind
          }
        })
      }
      else{
        that.errorFlag = true;
      }
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
    @import "../assets/css/add.scss";
 
</style>
