util.getQueryString = function(name) {
  var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
  var r = window.location.search.substr(1).match(reg);
  if(r!=null) return decodeURIComponent(r[2]); return null;
};

util.getParam = function(obj){
  return JSON.parse(obj || '{}');
}

util.goByUrl = function(url){
  location.href = url;
}

util.extend = function (target, source) {
  for (var p in source) {
    if (source.hasOwnProperty(p)) {
      target[p] = source[p];
    }
  }
  return target;
}

util.hasFeat = false;
util.showSaleFeat = function(){
  var roleId = util.cookie.getItem('__roleId');
  if( roleId == 8 ){
    var tabs = $('#ptabs');
    if(tabs.length > 0){
      tabs.removeClass('hidden');
      util.hasFeat = true;
    }
  }
}

util.validateTel = function(tel){
  tel = ''+tel;
  var telephone = tel && tel.replace(/-/g,"");
  return !telephone || !(/^((\+?86)|(\+86))?1[3|4|5|7|8][0-9]\d{8}$/.test(telephone)); 
}

util.updateTitle = function(title) {
  if (/iphone|ipad|ipod/.test(navigator.userAgent.toLowerCase())) {
    document.title = title;
    var iframeTmp = document.createElement('iframe');
    iframeTmp.style.display = 'none';
    iframeTmp.src = root + '/0.html';
    iframeTmp.onload = function() {
      setTimeout(function() {
        iframeTmp.onload = null;
        document.body.removeChild(iframeTmp);
      }, 0);
    };
    document.body.appendChild(iframeTmp);
  } else {
    document.title = title;
  }
};

util.cookie = (function(doc, win){
  return {
    getItem: function(key){
      var cookieKey = key + '=';
      var result = '';
      if(doc.cookie.length > 0){
        var index = doc.cookie.indexOf(cookieKey);
        if(index != -1){
          index += cookieKey.length;
          var lastIndex = doc.cookie.indexOf(';', index);
          if(lastIndex == -1){
            lastIndex = doc.cookie.length;
          }
          result = win.decodeURIComponent(doc.cookie.substring(index, lastIndex));
        }
      }
      return result;
    },
    setItem: function(key, value, expiresDays){
      var time = new Date();
      if(expiresDays){
        //将time设置为 expiresDays 天以后的时间 
        time.setTime(time.getTime()+expiresDays*24*3600*1000); 
      } else {
        time.setFullYear(time.getFullYear() + 1);
      }

      if (expiresDays == 0) {

        doc.cookie = key + '=' + win.encodeURIComponent(value) + ';';
      } else {

        doc.cookie = key + '=' + win.encodeURIComponent(value) + '; expires=' + time.toGMTString() + ';';
      }
      
    },
    removeItem: function(key){
      var time = new Date;
      time.setDate(time.getDate()-1); 
      doc.cookie = key + '=0; expires=' + time.toGMTString();
    }
  };
})(document, window);

util.storage = (function(doc, win){
  var localStorage = window.localStorage;
  // 优先使用localStorage
  if(localStorage){
    return {
      getItem: function(key){
        return localStorage.getItem(key);
      },
      setItem: function(key, value){
        // 在一些设备下, setItem之前必须调用removeItem
        localStorage.removeItem(key);
        localStorage.setItem(key, value);
      },
      removeItem: function(key){
        localStorage.removeItem(key);
      }
    };
  } else {
    return {
      getItem: util.cookie.getItem,
      setItem: util.cookie.setItem,
      removeItem: util.cookie.removeItem
    };
  }
})(document, window);

util.viewData = function() {
  var e = 0, l = 0, i = 0, g = 0, f = 0, m = 0;
  var j = window, h = document, k = h.documentElement;
  e = k.clientWidth || h.body.clientWidth || 0;
  l = j.innerHeight || k.clientHeight || h.body.clientHeight || 0;
  g = h.body.scrollTop || k.scrollTop || j.pageYOffset || 0;
  i = h.body.scrollLeft || k.scrollLeft || j.pageXOffset || 0;
  f = Math.max(h.body.scrollWidth, k.scrollWidth || 0);
  m = Math.max(h.body.scrollHeight, k.scrollHeight || 0, l);
  return {scrollTop: g,scrollLeft: i,documentWidth: f,documentHeight: m,viewWidth: e,viewHeight: l};
};

util.messageBox = function() {
  var messageBox = document.getElementById('messageBox');
  if(!messageBox){ return;}
  messageBox.addEventListener('touchmove', function(e) {
    e.preventDefault();
  }, false);

  var viewData = util.viewData();
  messageBox.style.top = (viewData.scrollTop - 10) + 'px';
  messageBox.style.height = (viewData.viewHeight + 20) + 'px';

  document.body.style.overflow = 'hidden';
  setTimeout(function() {
    var cHeight = messageBox.children[0].offsetHeight;
    messageBox.style.paddingTop = (viewData.viewHeight / 2 - cHeight / 2 - 30) + 'px';
    messageBox.classList.add('show');
    messageBox.style.display = 'block';
  }, 100);
};

util.messageBoxTips = function(txt) {
  var messageBox = document.getElementById('messageBox');
  if(!messageBox){ return;}
  messageBox.addEventListener('touchmove', function(e) {
    e.preventDefault();
  }, false);
  var tipsTxt = txt || '操作成功';
  messageBox.innerHTML = '<div class="common-msg-c common-msg-confirm"><div class="common-msg-tit">'+tipsTxt+'</div><div class="common-msg-menu"><div id="common-msg-btn">确定</div></div></div>';


  var viewData = util.viewData();
  messageBox.style.top = (viewData.scrollTop - 10) + 'px';
  messageBox.style.height = (viewData.viewHeight + 20) + 'px';

  document.body.style.overflow = 'hidden';
  setTimeout(function() {
    var cHeight = messageBox.children[0].offsetHeight;
    messageBox.style.paddingTop = (viewData.viewHeight / 2 - cHeight / 2 - 100) + 'px';
    messageBox.classList.add('show');
    messageBox.style.display = 'block';
  }, 100);
};



util.messageBox.hide = function() {
  document.body.style.overflow = 'visible';
  var messageBox = document.getElementById('messageBox');
  messageBox.classList.remove('show');
  setTimeout(function() {
    messageBox.style.display = 'none';
  }, 100);
};
/**
 * 将 Date 转化为指定格式的String
 * @param date Object
 * @param fmt String
 * 月(M)、日(d)、小时(h)、分(m)、秒(s)、季度(q) 可以用 1-2 个占位符 
 * 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字) 
 * date = date.replace(/-/g,"/"); util.dateFormatFmt(new Date(date),"MM月dd日")
 * util.dateFormatFmt( new Date(), "yyyy-MM-dd hh:mm:ss.S") ==> 2006-07-02 08:09:04.423 
 * util.dateFormatFmt( new Date(), "yyyy-M-d h:m:s.S")      ==> 2006-7-2 8:9:4.18 
 */

var MILLSECONDS_PER_DAY = 24 * 60 * 60 * 1000;
util.dateFormatFmt = function (date, fmt) {  
  var o = {
    "M+": date.getMonth() + 1, //月份 
    "d+": date.getDate(), //日 
    "h+": date.getHours(), //小时 
    "m+": date.getMinutes(), //分 
    "s+": date.getSeconds(), //秒 
    "q+": Math.floor((date.getMonth() + 3) / 3), //季度 
    "S": date.getMilliseconds() //毫秒 
  };
  if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
  for (var k in o)
  if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
  return fmt;
}
util.formatDate = function(date) {
  var year = date.getFullYear();
  var month = date.getMonth() + 1;
  month = month < 10 ? '0' + month : month;
  var day = date.getDate();
  day = day < 10 ? '0' + day : day;
  return [year, month, day].join('-');
};

util.dateCount = function(beginDate, endDate) {
  var date1 = new Date(util.dateFormatFmt(beginDate, 'yyyy-MM-dd'));
  var date2 = new Date(util.dateFormatFmt(endDate, 'yyyy-MM-dd'));
  return Math.ceil((date2.getTime() - date1.getTime()) / MILLSECONDS_PER_DAY);
};
