//接口
const root = process.env.API_HEAD;

export default{
    onlineUrl:{

        checkMeterurl:root+'/user/checkMeter',//查询电表

        bindingMeterurl:root+'/user/bindMeter',//绑定电表

        allUserMeterurl:root+'/user/getAllMeter',//所有电表

        remainderMeterurl:root+'/user/getMeter',//电表剩余金额

        buyMeterUrl:root+'/pay/buy',//用户购买

        orderListUrl:root+'/pay/orderlist',//支付列表

        payUrl:root+'/pay/getOrder', //支付完成

        unbindMeterurl:root+'/user/unbindMeter',//解绑电表

        remindThresholdurl:root+'/user/remindThreshold', //设置电表提醒阀值

        dayMeterurl:root+'/stat/day', //近7天用电量

        monthMeterurl:root+'/stat/month',//上月用电量
        
        yearMeterurl:root+'/stat/years' //去年用电量
    }
   
}