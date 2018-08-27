import Vue from 'vue'
import Router from 'vue-router'
import Ammeter from '../pages/Ammeter';
import Order from '../pages/Order';
import Add from '../pages/Add';
import Cardnumber from '../pages/Cardnumber';
import Detail from '../pages/Detail';
import MeterSet from '../components/Detail/MeterSet'
import MeterTrend from '../components/Detail/MeterTrend'
import OrderRecord from '../components/Detail/OrderRecord'
import MoreMonth from '../components/Detail/MoreMonth'
import Buy from '../pages/Buy';
import Pay from '../pages/Pay';

Vue.use(Router)

export default new Router({
  routes: [{
      path: '/ammeter',
      name: 'Ammeter',
      component: Ammeter,
    },
    {
      path: '/order',
      name: 'Order',
      component: Order,
    },
    {
      path: '/add',
      name: 'Add',
      component: Add,
    },
    {
      path: '/cardnumber',
      name: 'Cardnumber',
      component: Cardnumber,
    },
    {
      path: '/detail',
      name: 'Detail',
      component: Detail,
      children: [{
          path: 'meterset',
          name: 'MeterSet',
          component: MeterSet
        },
        {
          path: 'metertrend',
          name: 'MeterTrend',
          component: MeterTrend
        },
        {
          path: 'orderrecord',
          name: 'OrderRecord',
          component: OrderRecord,
        },
      ]
    },
    {
      path: '/moremonth',
      name: 'MoreMonth',
      component: MoreMonth,
    },
    {
      path: '/buy',
      name: 'Buy',
      component: Buy
    },
    {
      path: '/pay',
      name: 'Pay',
      component: Pay
    },

    {
      path: '*',
      redirect: '/ammeter'
    }

  ]
})
