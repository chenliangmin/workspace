<template>
  <div id="metertrend"  class="subpage">
    <com-routetitle>用电趋势</com-routetitle>
    <div class="metertrend_wrapper">
      <div>
        <div class="canvas_wrapper">
          <div class="day_title header_title">近7天用电量: <span>{{day_title}}°</span></div>
          <canvas id="canvas_day" class="canvas"></canvas>
        </div>
        <div class="canvas_wrapper">
          <div class="month_title header_title">上月用电量: <span>{{month_title}}°</span><button @click="jumpMoreMonth()">更多月份</button></div>
          <canvas id="canvas_month" class="canvas"></canvas>
        </div>
        <div class="canvas_wrapper">
          <div class="year_title header_title">近1年用电量: <span>{{year_title}}°</span></div>
          <canvas id="canvas_year" class="canvas"></canvas>
        </div>
      </div>
    </div>
  </div>

</template>

<script>
import {loadData,getSessionData,setSessionData,removeSessionData} from "../../assets/js/index" 
import URL_API from '../../api/index'

export default {
  name: 'MeterTrend',
  data(){
		return {
            day_title:0, //7天用电量
            month_title:0, //月用电量
            year_title:0, //年用电量
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
    jumpMoreMonth(){
      this.$router.push({path:'/moremonth'})
    },
    myCharts:function(name,lab,dat,cWidth,gra){
        var myChart = new Chart(name, {
            type: 'line', // line 表示是 曲线图，当然也可以设置其他的图表类型 如柱形图 : bar  或者其他
            data: {
                labels : lab, //按时间段 可以按星期，按月，按年
                datasets : [
                    {
                        //当前数据的说明
                        // fill: true,  //是否要显示数据部分阴影面积块  false:不显示
                        borderColor: '#5481fc',//数据曲线颜色
                        borderWidth:1, //数据线的粗细
                        backgroundColor:gra, //数据线下的背景色
                        pointRadius:0, //不显示数据点
                        data: dat,  //填充的数据
                    }
                ]
            },
            options: {
                legend:{
                    display: false
                },
                scales: {
                    xAxes: [{
                        gridLines: { //网格
                            color: "#fff",
                        },
                        ticks: { 
                            fontSize:(cWidth*100/750)*0.2 //x轴字体大小
                        }
                    }],
                    yAxes: [{
                        ticks: { 
                            fontSize:(cWidth*100/750)*0.2 //x轴字体大小
                        }
                    }],
                },
                
            },
        });
    },
    

  },
  created(){
      var yugi = function(n){
            var now = new Date;
            now.setDate(now.getDate() - n);
            return now.getMonth()+1+'/'+now.getDate()
        }
        
        yugi(1);
  },
  mounted(){
     this.metertrendScroll = new IScroll(".metertrend_wrapper",{ //滚动
      probeType: 3,
      mouseWheel: true, 
      click: true,
      tap: true
    });

    // 定义时间，数据请求
    let date = new Date();
    let year = date.getFullYear(),
        month = paddNum(date.getMonth()+1),
        day = paddNum(date.getDate());
    let data1 = year+'-'+month+'-'+day;
    let data2 = '';
    if(date.getMonth()==0){
       data2 = (year-1)+'-'+12;
    }else{
       data2 = year +'-'+paddNum(date.getMonth());
    }
    
    let data3 = year;
    let xArr1 = [],xArr2 = ["01","05","10","15","20","25","30"],xArr3 = [];
    let yArr1 = [0,0,0,0,0,0,0],yArr2 = [0,0,0,0,0,0,0],yArr3 = [0,0,0,0,0,0,0,0,0,0,0,0];
    let yyArr = [];
    for (let index = 7; index >0; index--) {  //近7日
        var now = new Date;
        now.setDate(now.getDate() - index);
        month = (now.getMonth()+1) >9 ?now.getMonth()+1 : '0' +(now.getMonth()+1)
        xArr1.push(month+'/'+(now.getDate()>9?now.getDate():'0'+now.getDate()))   
    }
    for (let index = 12; index > 0; index--) { //近1年
        if((date.getMonth()+1)-index>0){
            xArr3.push(paddNum(date.getMonth()+1-index));
            yyArr.push(year +'-'+paddNum(date.getMonth()+1-index));
        }
        else{
            xArr3.push(paddNum(date.getMonth()+1-index+12));
            yyArr.push(year-1 +'-'+paddNum(date.getMonth()+1-index+12));
        } 
    }
    function paddNum(num){//小于10添0
        return num>9?num:'0'+num;
    }

    let  clientWidth = document.documentElement.clientWidth;
            //根据设计图中的canvas画布的占比进行设置
    let canvasWidth = clientWidth*100/750*6.9,
        canvasHeight = clientWidth*100/750*2.4;
        document.getElementById("canvas_day").setAttribute('width',canvasWidth+'px'); //图1 宽
        document.getElementById("canvas_day").setAttribute('height',canvasHeight+'px');//图1 高
        document.getElementById("canvas_month").setAttribute('width',canvasWidth+'px');//图2 宽
        document.getElementById("canvas_month").setAttribute('height',canvasHeight+'px');//图2 高
        document.getElementById("canvas_year").setAttribute('width',canvasWidth+'px');//图3 宽
        document.getElementById("canvas_year").setAttribute('height',canvasHeight+'px');//图3 高

    let ctx1 = document.getElementById("canvas_day").getContext("2d"),   //曲线1
        gradient1 = ctx1.createLinearGradient(0, 0, 0, 300);
        gradient1.addColorStop(0, 'rgba(76, 123, 253, 0.5)');
        gradient1.addColorStop(1, 'rgba(255, 255, 255, 0.1)');
    let ctx2 = document.getElementById("canvas_month").getContext("2d"),  //曲线2
        gradient2 = ctx2.createLinearGradient(0, 0, 0, 300);
        gradient2.addColorStop(0, 'rgba(76, 123, 253, 0.5)');
        gradient2.addColorStop(1, 'rgba(255, 255, 255, 0.1)');
    let ctx3 = document.getElementById("canvas_year").getContext("2d"),  //曲线3
        gradient3 = ctx3.createLinearGradient(0, 0, 0, 300);
        gradient3.addColorStop(0, 'rgba(76, 123, 253, 0.5)');
        gradient3.addColorStop(1, 'rgba(255, 255, 255, 0.1)');


    let that = this;
    loadData({   //日
        url:`${URL_API.onlineUrl.dayMeterurl}` ,
        dayCallback: function(data) {
            if(data&&data.code==0) {
                for (let index = 0; index < data.content.length; index++) {
                    that.day_title = that.day_title + parseFloat(data.content[index].used);
                    let Arr = data.content[index].day.split('-');
                    if((xArr1.indexOf(Arr[1]+'/'+ Arr[2])!=-1)){
                        yArr1.splice(xArr1.indexOf(Arr[1]+'/'+ Arr[2]),1,parseFloat(data.content[index].used)) //7天y轴数据，没有数据为0
                    }
                } 
                that.day_title = that.day_title.toFixed(2);
                let lab1 = xArr1,
                    dat1 = yArr1;
                that.myCharts(ctx1,lab1,dat1,clientWidth,gradient1); //曲线1
            }
        },
        data: {
            openid: '94a7aca8944bded58b8d762d5666c586',
            // openid: that.getQueryString("openid")?that.getQueryString("openid"):getSessionData('openid'),
            meterNo:getSessionData('meterNo'),
            day:7
        }

    })
    loadData({   //月
        url:`${URL_API.onlineUrl.monthMeterurl}` ,
        monthCallback: function(data) {
            if(data&&data.code==0) {
                for (let index = 0; index < data.content.length; index++) {
                    that.month_title = that.month_title + parseFloat(data.content[index].used);
                    let Arr = data.content[index].day.split('-');
                    if(xArr2.indexOf(Arr[2])!=-1){
                        yArr2.splice(xArr2.indexOf(Arr[2]),1,parseFloat(data.content[index].used)) //上月y轴数据，没有数据时显示0
                    }
                } 
                that.month_title = that.month_title.toFixed(2);
                let lab2 = xArr2,
                    dat2 = yArr2;
                that.myCharts(ctx2,lab2,dat2,clientWidth,gradient2); //曲线2
            }
        },
        data: {
            // openid: '94a7aca8944bded58b8d762d5666c586',
            openid: that.getQueryString("openid")?that.getQueryString("openid"):getSessionData('openid'),
            meterNo:getSessionData('meterNo'),
            month:data2
        }

    })
    loadData({   //年
        url:`${URL_API.onlineUrl.yearMeterurl}` ,
        yearsCallback: function(data) {
            if(data&&data.code==0) {
                if(data&&data.code==0) {
                    for (let index = 0; index < data.content.length; index++) {
                        that.year_title = that.year_title + parseFloat(data.content[index].used);
                        if(yyArr.indexOf(data.content[index].month)!=-1){
                            yArr3.splice(yyArr.indexOf(data.content[index].month),1,parseFloat(data.content[index].used)) //近1年y周数据，没有数据时显示0
                        }
                    } 
                    that.year_title=that.year_title.toFixed(2);
                    let lab3 = xArr3,
                        dat3 = yArr3;
                    that.myCharts(ctx3,lab3,dat3,clientWidth,gradient3); //曲线2
                }
            }
        },
        data: {
            // openid: '94a7aca8944bded58b8d762d5666c586',
            openid: that.getQueryString("openid")?that.getQueryString("openid"):getSessionData('openid'),
            meterNo:getSessionData('meterNo'),
        }

    })  
  },
  updated(){
    this.metertrendScroll.refresh();
  }


}
</script>

<style scoped lang='scss'>
@import "../../assets/css/detail/metertrend.scss";
</style>