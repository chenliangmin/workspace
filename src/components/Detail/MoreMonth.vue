<template>
  <div id="moremonth" class="pages">
    <div class="moremonth_tab one-bottom-px"> <!--<span @click="clickBack()"></span>-->更多月份</div>
    <div class="bg_bottom"></div>
    <ul class="moremonth_wrapper one-bottom-px one-top-px">
      <li class="one-bottom-px">
        <div class="wra_left">选择月份：</div>
        <div class="wra_right" id="trigger">{{lastMonth}}</div>
      </li>
      <li class="one-bottom-px">
        <div class="wra_left">电表号码：</div>
        <div class="wra_right">{{meterNo}}</div>
      </li>
      <li>
        <div class="wra_left">本月电量合计：</div>
        <div class="wra_right yearKwh">{{yearKwh}}°</div>
      </li>
    </ul>
    <div class="bg_bottom"></div>
    <div class="iscroll_wrapper">
      <ul class="data_wrapper">
        <div v-show="noDataFlag" class="noData">未查询到当前月份的用电数据</div>
        <li v-for="(item, index) in items" :key="index" class="li_data">
          <div  class="wra_left">{{item.day}}</div>
          <div  class="wra_right">{{item.used}}°</div>
        </li>
      </ul>
    </div>
  </div>

</template>

<script>
import MobileSelect from 'mobile-select'
import {loadData,getSessionData,setSessionData,removeSessionData} from "../../assets/js/index" 
import URL_API from '../../api/index'
export default {
  name: 'MoreMonth',
  data(){
		return {
      meterNo:getSessionData('meterNo'),
      yearKwh:0,
      lastMonth:this.getMon(),
      items:[],
      noDataFlag:false
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
 
    //获取上月
    getMon:function(){
      let dt = new Date();
      dt.setMonth(dt.getMonth()-1);
      let y = dt.getFullYear(); //年
      let m = dt.getMonth()+1;  //月
      m = m<10?'0'+m:m;
      return y+'年'+m+'月';
    },
    initData:function(){
      let that = this;
      let d = new Date();
      let y = d.getFullYear();
      let m = d.getMonth();
      // m = m<10?'0'+m:m;
      let time = '';
      if(m==0){
       time = (y-1)+'-'+12;
      }else{
        time = y +'-'+ (m<10?'0'+m:m);
      }
      loadData({
          url: `${URL_API.onlineUrl.monthMeterurl}`,
          monthCallback: function(data) {
            if(data && data.code == 0) {
              if (data.content.length==0) {
                that.noDataFlag = true
              }
              else{
                that.noDataFlag = false
                for (let index = 0; index < data.content.length; index++) {
                  let Arr = data.content[index].day.split('-');
                  data.content[index].day = Arr[1]+'月'+Arr[2]+'日';
                  that.yearKwh = that.yearKwh + parseFloat(data.content[index].used);
                 }
                 that.yearKwh = (that.yearKwh).toFixed(2)
               that.items = data.content;
              }
            }
          },
          data: {
            // openid: '94a7aca8944bded58b8d762d5666c586',
            openid: that.getQueryString("openid")?that.getQueryString("openid"):getSessionData('openid'),
            meterNo:that.meterNo,
            month:time
          }
        })
    },
    
  },
  created(){

  },
  mounted(){
    this.initData();
    this.moremonthScroll = new IScroll(".iscroll_wrapper",{ //滚动
      probeType: 3,
      mouseWheel: true, 
      click: true,
      tap: true
    });
  
    let that = this;
    // 获取上六个月
    let data=new Date();  
    let year=data.getFullYear();  
    let mon=data.getMonth()+1;  
    let arry=new Array();  
    for(var i=0;i<=5;i++){  
      mon=mon-1;  
      if(mon<=0){  
        year=year-1;  
        mon=mon+12;  
      }
      if(mon<10){  
        mon="0"+mon;  
      }   
      arry[i]=year+'年'+mon+'月';  
    }
    arry.reverse();

     //弹出月份选择
    let mobileSelect = new MobileSelect({
      trigger: "#trigger",
      title: "",
      wheels: [
        {data: arry},
      ],
      position:[5],
      callback:function(indexArr, data){ 
        let monthChange = data[0].replace(/年/g,'-').replace(/月/g,'');
        that.yearKwh = 0;
        that.items = [];
        loadData({
          url: `${URL_API.onlineUrl.monthMeterurl}`,
          monthCallback: function(data) {
            if(data && data.code == 0) {
             if (data.content.length==0) {
                that.noDataFlag = true
              }
              else{
                that.noDataFlag = false
                for (let index = 0; index < data.content.length; index++) {
                  let Arr = data.content[index].day.split('-');
                  data.content[index].day = Arr[1]+'月'+Arr[2]+'日';
                  that.yearKwh = that.yearKwh + parseFloat(data.content[index].used);
                  that.items.push(data.content[index]) ;
                }
                that.yearKwh = (that.yearKwh).toFixed(2)
               
              }
  
            }
          },
          data: {
            // openid: '94a7aca8944bded58b8d762d5666c586',
            openid: that.getQueryString("openid")?that.getQueryString("openid"):getSessionData('openid'),
            meterNo:that.meterNo,
            month:monthChange
          }
        })
      }
    });


  },
  updated(){
    this.moremonthScroll.refresh();
  }

}
</script>

<style scoped lang='scss'>
@import "../../assets/css/detail/moremonth.scss";
</style>