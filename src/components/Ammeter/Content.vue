<template>
<div class="ammeter_content pages" v-show="contentFlag">
    <com-loading :load='loadFlag'></com-loading>
    <com-header></com-header>
 <div class="ammeter_wrapper">
     <ul class="ammeter_ul">
        <li class="ammeter_li one-bottom-px one-top-px"
        v-for="(item,index) in ammeterArr" :key="index"
        @click.stop="jumpDetail(item.meterNo,item.kwh)"
        >
            <div class="li_title">
                剩余电量 截止 {{timeData}}
            </div>
            <div :class="{red:item.kwh<200,orange:item.kwh>200&&item.kwh<=800,green:item.kwh>800}">
                <div class="li_content">
                    <div class="dianlian_content">
                        <span>{{item.kwh}}°</span>
                    </div>
                    <div class="dianlian_l" :style="'width:'+ ((item.kwh/5000)*100<100?(item.kwh/5000)*100:100) +'%;'">
                    </div>
                    <div class="dianlian_r"></div>
                </div>
                <div class="dianlian_right"></div>
            </div>
            <div class="li_meterno">
                {{item.meterNo}}
            </div>
            <div class="li_meteraddress">
                {{item.meterAddress}}
            </div>
            <div class="li_metername">
                {{item.meterName}}
            </div>
            <div class="buy_ammeter" @click.stop="jumpBuy(item.meterNo,item.meterAddress,item.meterName)">
                立即购电
            </div>
        </li>
    
    </ul>
 </div>
 <div class="add_ammeter" @click="jumpAdd()"></div>
</div>
</template>

<script>
import {loadData,setSessionData,getSessionData,removeSessionData} from "../../assets/js/index" 
import URL_API from '../../api/index'
import Store from '../../store/index';

 export default {
   name:'Content',
   data () {
     return {
        contentFlag:getSessionData('contentFlag')==='true'?true:false,
        ammeterArr:[],
        loadingFlag:true,
        timeData:'',
        openidFlag:false,
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
    jumpDetail(id,kwh){ //跳转详情
      setSessionData("meterNo",id)
      setSessionData("kwh",kwh)
      this.$router.push({path:'/detail'})
    },
    jumpBuy(id,address,location){ //跳转购买
      setSessionData("meterNo",id)
      setSessionData("meterAddress",address)
      setSessionData("meterName",location)
       this.$router.push({path:'/buy'})
    },
    jumpAdd(){ //跳转添加电表
      if(getSessionData("cardNumber")){
        removeSessionData("cardNumber");
      }
      if(getSessionData("phoneNumber")){
        removeSessionData("phoneNumber");
      }
      this.$router.push({path:'/add'})
    },
    // post查询用户所有电表
    postInquiryAll(){
      let that = this ; 
      loadData({
    		url: `${URL_API.onlineUrl.allUserMeterurl}`,
    		getAllMeterCallback: function(data) {
    			if(data && data.code == 0) {
            that.loadFlag = true;
            for (let index = 0; index < data.content.length; index++) {
              that.ammeterArr.push(data.content[index])
              that.loadingFlag = false
            }
            if(that.ammeterArr.length == 0 ){
                Store.$emit('bindFlag',true)
                setSessionData('contentFlag',false);
            }
            else{
                that.contentFlag = true;
                setSessionData('contentFlag',true);
            }
    			}
    		},
    		data: {
                // openid: '94a7aca8944bded58b8d762d5666c586'
             openid: that.getQueryString("openid")?that.getQueryString("openid"):getSessionData('openid')
    		}
      })
    },
    openidFun:function(){
      let openid= this.getQueryString("openid")?this.getQueryString("openid"):getSessionData('openid')
      if(openid===null){ 
        //判断是否有openid
        Store.$emit('openidFlag',true)
      }
      else{
        Store.$emit('openidFlag',false) 
      }
    },
    initData:function(){
      // 时间
      let myDate = new Date();
      this.timeData = myDate.getFullYear()+""+((myDate.getMonth()+1)>9?(myDate.getMonth()+1):"0"+(myDate.getMonth()+1))+""+(myDate.getDate()>9?myDate.getDate():'0'+myDate.getDate())+" "+(myDate.getHours()>9?myDate.getHours():'0'+myDate.getHours())+":"+(myDate.getMinutes()>9?myDate.getMinutes():'0'+myDate.getMinutes());
      if(this.ammeterArr.length>0){
       //判断是否有绑定电表
        Store.$emit('bindFlag',true)
      }
      else{
        Store.$emit('bindFlag',false)
      }
    
    }
   },
   created(){

   },
   mounted(){
    this.openidFun();
    this.initData(); 
    this.postInquiryAll() // post查询用户所有电表
    this.ammeterScroll = new IScroll(".ammeter_wrapper",{
      probeType: 3,
      mouseWheel: true, 
      click: true,
      tap: true
    });
   },
   updated(){
     this.ammeterScroll.refresh();
   },
   destroyed(){

   },
 }
</script>

<style  scoped lang='scss'>
    @import "../../assets/css/ammeter";
 
</style>
