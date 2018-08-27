// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import "./assets/css/core.css"
import Vue from 'vue'
import App from './App'
import router from './router'
import Header from './common/Header'
import Title from './common/Title';
import Routetitle from './common/Routetitle';
import Loading from './common/Loading';

Vue.config.productionTip = false
Vue.component('com-header', Header)  
Vue.component('com-title',Title)
Vue.component('com-routetitle',Routetitle)//注册公共组件
Vue.component('com-loading',Loading) //注册正在加载组件

Vue.prototype.$title=function(title){  //vue添加动态设置title
  document.title=title;
  var iframe=document.createElement("iframe");
  iframe.style.display='none';
  iframe.setAttribute('src',location.href);
  var loadedCallback=()=>{
    iframe.removeEventListener('load',loadedCallback);
    document.body.removeChild(iframe);
  };
  iframe.addEventListener('load',loadedCallback);
  document.body.appendChild(iframe);

};

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
