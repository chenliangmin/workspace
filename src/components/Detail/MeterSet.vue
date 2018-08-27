<template>
  <div id="meterset" class="subpage">
    <com-routetitle>用电设置</com-routetitle>
    <div class="meterset_info">
      <div class="meterset_biaohao">{{meterNo}}</div>
      <div class="meterset_address">{{meterAddress}}</div>
      <div class="meterset_location">{{meterName}}</div>
    </div>
    <div class="meterset_remind"  v-show="type=='2'">
      <label>电量提醒设置(度):</label>
      <input type="tel" 
        id="eleRemind" 
        name="eleRemind" 
        v-model="remindThreshold" 
        placeholder="请输入度数（不低于0°）" 
        onfocus="this.placeholder=''" 
        onblur="this.placeholder='请输入度数（不低于0°）'"
        @click="errorTip()"
       />
    </div>
    <div class="errorTips" v-show="errorFlag"><p>电量提醒设置度数需填写不低于0°的整值</p></div>
    <div class="meterset_btn">
      <button class="meterset_confirm" @click="comfirm()" v-show="type=='2'">确定</button>
      <button class="meterset_delete" @click="deleteMeter()">删除电表</button>
    </div>
  </div>

</template>

<script>
import {loadData,getSessionData,setSessionData,removeSessionData} from "../../assets/js/index" 
import URL_API from '../../api/index'
export default {
  name: 'MeterSet',
  data(){
		return {
      meterNo:getSessionData('meterNo'),
      meterAddress:getSessionData('meterAddress'),
      meterName:getSessionData('meterName'),
      remindThreshold:getSessionData('remindThreshold'),
      type:getSessionData('meterType'),
      errorFlag:false
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
    comfirm(){  //设置或修改电表提醒阀值
      let that = this;
      if (/^\d+$/.test(that.remindThreshold)||!that.remindThreshold) {
        loadData({
          url: `${URL_API.onlineUrl.remindThresholdurl}`,
          remindThresholdCallback: function(data) {
            if(data&&data.code==0) {
              setSessionData('remindThreshold',that.remindThreshold)
              that.$router.push({
                  path:'/detail'
                })
            }
          },
          data: {
            // openid: '94a7aca8944bded58b8d762d5666c586',
            openid: that.getQueryString("openid")?that.getQueryString("openid"):getSessionData('openid'),
            meterNo:getSessionData('meterNo'),
            remindThreshold:that.remindThreshold
          }
        
        })
      }
      else{
        that.errorFlag = true;
      }
    
    },
    deleteMeter(){  //删除电表
      let that = this;
      loadData({
        url: `${URL_API.onlineUrl.unbindMeterurl}`,
    		unbindMeterCallback: function(data) {
    			if(data&&data.code==0) {
            that.$router.push({
              path:'/ammeter'
            })
    			}
    		},
    		data: {
          // openid: '94a7aca8944bded58b8d762d5666c586',
          openid: that.getQueryString("openid")?that.getQueryString("openid"):getSessionData('openid'),
          meterNo:getSessionData('meterNo')
    		}
    	
      })
    },
    errorTip(){  //错误提示
      this.errorFlag = false;

      var oHeight = $(document).height(); //浏览器当前的高度

      $(window).resize(function(){

        if($(document).height() < oHeight){

          $(".meterset_btn").css("position","static");
        }else{

          $(".meterset_btn").css("position","absolute");
        }
      });


    }
  },
  created(){

  }

}
</script>

<style scoped lang='scss'>
@import "../../assets/css/detail/meterset.scss";
</style>