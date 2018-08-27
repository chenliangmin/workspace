
import URL_API from '../../api/index.js'

// sessionStorage
export function setSessionData(index,value){ 
	sessionStorage.setItem(index, value);
};
export function getSessionData(index){
	return sessionStorage.getItem(index);
};
export function removeSessionData(index){
	return sessionStorage.removeItem(index);
};

//封装jsonp
export function loadData(param) {
    var p = $.extend({ url: "", type: "get", async: true, dataType: "jsonp", callbackName: '', callback: null}, param);
    if (p.showload) {
        showLoading();
    }
    var cbName = "";
    var cbFn = null;
    if(!p.callbackName){
        var connt = 0;
        for (var i in param) {
            connt++;
            if (connt == 2) {
                cbName = i;
                cbFn = param[i];
                break;
            }
        }
    }else{
        cbName = p.callbackName;
        cbFn = p.callback;
    }
    // param.data.enterId = window.enterId;
    return $.ajax({
        type: p.type,
        data: param.data,
        async: p.async,
        url: p.url,
        dataType: p.dataType,
        jsonpCallback: cbName,
        success: function(data) {
            cbFn(data);
        },
        error: function(e,m) {
            if(m=="error"){
                m = "net exception";
            }
            if (p.showError) {
                alert("抱歉请稍后再试");
            }
            if (param.error) { param.error() };
        }
    });
};

