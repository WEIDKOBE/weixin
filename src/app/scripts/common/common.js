 // 配置 fastclick, 解决IOS下的点击事件300ms延迟
if ('addEventListener' in document) {
    document.addEventListener('DOMContentLoaded', function() {
        FastClick.attach(document.body);
    }, false);
}

var util = {};;

// __inline('./CONSTANT.js');

util.getQueryString = function(name) {
  var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
  var r = window.location.search.substr(1).match(reg);
  if (r != null) return decodeURIComponent(r[2]);
  return null;
};

util.getParam = function(obj) {
  return JSON.parse(obj || '{}');
}

util.goByUrl = function(url) {
  location.href = url;
}

util.extend = function(target, source) {
  for (var p in source) {
    if (source.hasOwnProperty(p)) {
      target[p] = source[p];
    }
  }
  return target;
}

util.hasFeat = false;
util.showSaleFeat = function() {
  var roleId = util.cookie.getItem('__roleId');
  if (roleId == 8) {
    var tabs = $('#ptabs');
    if (tabs.length > 0) {
      tabs.removeClass('hidden');
      util.hasFeat = true;
    }
  }
}

util.validateTel = function(tel) {
  tel = '' + tel;
  var telephone = tel && tel.replace(/-/g, "");
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

util.cookie = (function(doc, win) {
  return {
    getItem: function(key) {
      var cookieKey = key + '=';
      var result = '';
      if (doc.cookie.length > 0) {
        var index = doc.cookie.indexOf(cookieKey);
        if (index != -1) {
          index += cookieKey.length;
          var lastIndex = doc.cookie.indexOf(';', index);
          if (lastIndex == -1) {
            lastIndex = doc.cookie.length;
          }
          result = win.decodeURIComponent(doc.cookie.substring(index, lastIndex));
        }
      }
      return result;
    },
    setItem: function(key, value, expiresDays) {
      var time = new Date();
      if (expiresDays) {
        //将time设置为 expiresDays 天以后的时间
        time.setTime(time.getTime() + expiresDays * 24 * 3600 * 1000);
      } else {
        time.setFullYear(time.getFullYear() + 1);
      }

      if (expiresDays == 0) {

        doc.cookie = key + '=' + win.encodeURIComponent(value) + ';';
      } else {

        doc.cookie = key + '=' + win.encodeURIComponent(value) + '; expires=' + time.toGMTString() + ';';
      }

    },
    removeItem: function(key) {
      var time = new Date;
      time.setDate(time.getDate() - 1);
      doc.cookie = key + '=0; expires=' + time.toGMTString();
    }
  };
})(document, window);

util.storage = (function(doc, win) {
  var localStorage = window.localStorage;
  // 优先使用localStorage
  if (localStorage) {
    return {
      getItem: function(key) {
        return localStorage.getItem(key);
      },
      setItem: function(key, value) {
        // 在一些设备下, setItem之前必须调用removeItem
        localStorage.removeItem(key);
        localStorage.setItem(key, value);
      },
      removeItem: function(key) {
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
  var e = 0,
    l = 0,
    i = 0,
    g = 0,
    f = 0,
    m = 0;
  var j = window,
    h = document,
    k = h.documentElement;
  e = k.clientWidth || h.body.clientWidth || 0;
  l = j.innerHeight || k.clientHeight || h.body.clientHeight || 0;
  g = h.body.scrollTop || k.scrollTop || j.pageYOffset || 0;
  i = h.body.scrollLeft || k.scrollLeft || j.pageXOffset || 0;
  f = Math.max(h.body.scrollWidth, k.scrollWidth || 0);
  m = Math.max(h.body.scrollHeight, k.scrollHeight || 0, l);
  return {
    scrollTop: g,
    scrollLeft: i,
    documentWidth: f,
    documentHeight: m,
    viewWidth: e,
    viewHeight: l
  };
};

util.messageBox = function() {
  var messageBox = document.getElementById('messageBox');
  if (!messageBox) {
    return;
  }
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
  if (!messageBox) {
    return;
  }
  messageBox.addEventListener('touchmove', function(e) {
    e.preventDefault();
  }, false);
  var tipsTxt = txt || '操作成功';
  messageBox.innerHTML = '<div class="common-msg-c common-msg-confirm"><div class="common-msg-tit">' + tipsTxt + '</div><div class="common-msg-menu"><div id="common-msg-btn">确定</div></div></div>';


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
util.dateFormatFmt = function(date, fmt) {
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
};;
// 模板doT配置
doT.templateSettings = {
  evaluate: /\<\%([\s\S]+?)\%\>/g,
  interpolate: /\<\%=([\s\S]+?)\%\>/g,
  varname: 'it'
};


// config_new.js
var _config = {};
var ctx = '/supplier';
/**
 * 每个页面必须的一步
 */
_config.isWx = navigator.userAgent.indexOf('MicroMessenger/') != -1 ? true : false;
if (true) {
  var root = location.origin + ctx;
} else {
  var root = 'https://hotel-test.rsscc.com' + ctx;
}
//https://hotel-test.rsscc.com
//http://192.168.10.255:8083/supplier
var noPageUrl = './404.html';;

// https://hotel-sp.huoli.com/supplier/orderList.html&sessionStorage_view_orderList_id@@9214&response_type=code&scope=snsapi_base&state=STATE&connect_redirect=1#wechat_redirect
function getUrlParams() {
  var paramStr = location.href.split("?")[1];
  var paramArrays = [];
  if (paramStr) {
    var paramArrays = paramStr.split('#')[0].split("&");
  }
  var urlParams = {};
  paramArrays.forEach(function(e) {
    e = e.replace(/@@@@/g, "?").replace(/@@/g, "=").replace(/@/g, '/');
    var keyValue = e.split("=");
    urlParams[keyValue[0]] = decodeURI(keyValue[1]);
  });
  for (index in urlParams) {
    if (index.indexOf('sessionStorage') == 0) {
      sessionStorage[index] = urlParams[index];
    }
  }
  return urlParams;
}

function onlyDigital(e) {
  if (e.keyCode == 8) {

  } else if (e.type == 'keypress' || e.type == 'keydown') {
    e.preventDefault();
    var keyCode = e.keyCode;
    if (keyCode >= 48 && keyCode <= 57) {
      var value = $(this).val();
      value += String.fromCharCode(keyCode);
      $(this).val(value.replace(/[^0-9]/g, ''));
    }
  } else {
    var value = $(this).val();
    var keyCode = value.charCodeAt(value.length - 1);
    if (keyCode < 48 || keyCode > 57) {
      // console.log(value);
      value = value.substring(0, value.length - 1);
      $(this).val(value.replace(/[^0-9]/g, ''));
    }
  }
}



//浏览器兼容问题
if (typeof window.console === 'undefined') {
  window.console = {
    log: function() {}
  };
}

function computeDays(startTime, endTime) {
  if (startTime == null || startTime == '' || endTime == null || endTime == '') {
    return 0;
  } else {
    var endTime = new Date(endTime);
    var startTime = new Date(startTime);
    endTime.setHours(0);
    startTime.setHours(0);
    var secondes = endTime.getTime() - startTime.getTime();
    return Math.round(secondes / (1000 * 60 * 60 * 24));
  }
}

//对Date的扩展，将 Date 转化为指定格式的String
//月(M)、日(d)、小时(h)、分(m)、秒(s)、季度(q) 可以用 1-2 个占位符，
//年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字)
//例子：
//(new Date()).Format("yyyy-MM-dd hh:mm:ss.S") ==> 2006-07-02 08:09:04.423
//(new Date()).Format("yyyy-M-d h:m:s.S")      ==> 2006-7-2 8:9:4.18
Date.prototype.Format = function(fmt) { //author: meizz
    var o = {
      "M+": this.getMonth() + 1, //月份
      "d+": this.getDate(), //日
      "h+": this.getHours(), //小时
      "m+": this.getMinutes(), //分
      "s+": this.getSeconds(), //秒
      "q+": Math.floor((this.getMonth() + 3) / 3), //季度
      "S": this.getMilliseconds() //毫秒
    };
    if (/(y+)/.test(fmt))
      fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
      if (new RegExp("(" + k + ")").test(fmt))
        fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
  }
  //对Date的扩展，将Date剪切指定位置之后的时间
  //

Date.prototype.CutTime = function() {
  this.setHours(0);
  this.setMinutes(0);
  this.setSeconds(0);
  return this.getTime();
}

Array.prototype.getSortedArray = function(fun) {
  return typeof fun == 'undefined' ? this.sort(function(a, b) {
      return a - b
    }) :
    this.sort(function(a, b) {
      return fun.call(a) - fun.call(b);
    });
}
Array.prototype.copy = function() {
  var array = [];
  this.forEach(function(value) {
    array.push(value);
  });
  return array;
}
Array.prototype.forEach = Array.prototype.forEach || function(fun /*, thisp*/ ) {
  var len = this.length;
  if (typeof fun != "function")
    throw new TypeError();

  var thisp = arguments[1];
  for (var i = 0; i < len; i++) {
    if (i in this)
      fun.call(thisp, this[i], i, this);
  }
};

//对 Math 对象的扩展
Math.log2 = Math.log2 || function(value) {
  return Math.log(value) / Math.log(2);
}

/**
 * 提示信息
 */
var _amain = {
  Messager: {
    alert: function(msg, fun) {
      //1. 提供一个确认框，显示文字，点击确定按钮则隐藏按钮
      var alertHtml = '<div id="amain-messager-alert">' +
        '<div class="amain-messager-alert-container">' +
        '<div class="amain-messager-alert-text"></div>' +
        '<div class="amian-messager-alert-button">确定</div>' +
        '</div>' +
        '</div>';
      $('#amain-messager-alert').remove();
      $('body').append(alertHtml);
      $('#amain-messager-alert .amain-messager-alert-text').html(msg);
      $('#amain-messager-alert .amian-messager-alert-button').off('click').click(fun).click(function() {
        $('#amain-messager-alert').remove();
      });
    },
    confirm: function(msg, fun) {
      var confirmHtml = '<div id="amain-messager-confirm">' +
        '<div class="amain-messager-confirm-container">' +
        '<div class="amain-messager-confirm-text">要怎么怎么样吗？</div>' +
        '<div class="amain-messager-confirm-operator">' +
        '<div class="amain-messager-confirm-confirm amain-messager-confirm-button">是</div>' +
        '<div class="amain-messager-confirm-cancel amain-messager-confirm-button">否</div>' +
        '</div>' +
        '</div>' +
        '</div>';
      $('#amain-messager-confirm').remove();
      $('body').append(confirmHtml);
      $('#amain-messager-confirm .amain-messager-confirm-text').html(msg);
      $('#amain-messager-confirm .amain-messager-confirm-confirm').off('click').click(fun).click(function() {
        $('#amain-messager-confirm').remove();
      });
      $('#amain-messager-confirm .amain-messager-confirm-cancel').off('click').click(function() {
        $('#amain-messager-confirm').remove();
      });
    }
  },
  tips: {
    config: {

    },
    open: function(msg) {
      clearInterval(_amain.tips.temp.interval);
      var tips_div = document.getElementById('_amain_tips_container');
      if (!tips_div) {
        tips_div = document.createElement('div');
        tips_div.setAttribute("id", "_amain_tips_container");
        tips_div.setAttribute('style', 'position: fixed;top: 0px;width: 100%;');
        var html =
          "<div class='_amain_tips' style='border-radius: 2px;text-align: center; max-width: 200px; margin:auto; padding:10px; background-color:#f8f8f8; color:#1fbcd2'>" +
          "<div class='_amain_tips_msg'></div>" +
          "<div class='_amain_tips_progress_bar' style='margin-top:10px; width:100%; height:4px; background-color:#38DACE;'></div>" +
          "</div>";
        tips_div.innerHTML = html;
        document.body.appendChild(tips_div);
      }
      tips_div.children[0].children[0].innerHTML = msg;
      tips_div.children[0].children[1].style.width = '100%';
      tips_div.style.top = -tips_div.clientHeight + 'px';
      this.slideDown(tips_div);
      _amain.tips.temp.ele = tips_div;
    },
    slide: function(ele, direction, seconds) {
      if (ele != null) {
        _amain.tips.temp.ele = ele;
      } else {
        ele = _amain.tips.temp.ele;
      }
      var height = ele.clientHeight;
      var millseconds = 1000 * seconds;
      var interval = millseconds / height;
      if ((ele.style.top == '0px' | ele.style.top == '-1px') && direction == 'up') {
        clearInterval(_amain.tips.temp.interval);
        _amain.tips.temp.interval = setInterval(function() {
          var top = parseInt(_amain.tips.temp.ele.style.top.replace('px', ''));
          if ((top + _amain.tips.temp.ele.clientHeight) == 0) {
            clearInterval(_amain.tips.temp.interval);
          } else {
            _amain.tips.temp.ele.style.top = (top - 1) + 'px';
          }
        }, interval);
      } else if (ele.style.top == ('-' + height + 'px') && direction == 'down') {
        clearInterval(_amain.tips.temp.interval);
        _amain.tips.temp.interval = setInterval(function() {
          var top = parseInt(_amain.tips.temp.ele.style.top.replace('px', ''));
          if (top == 0) {
            clearInterval(_amain.tips.temp.interval);
            _amain.tips.progress(2);
          } else {
            _amain.tips.temp.ele.style.top = (top + 1) + 'px';
          }
        }, interval);
      }
    },
    slideDown: function(ele) {
      this.slide(ele, 'down', 0.5);
    },
    slideUp: function(ele) {
      this.slide(ele, 'up', 0.5);
    },
    progress: function(seconds) {
      var interval = seconds * 10;
      clearInterval(_amain.tips.temp.interval);
      _amain.tips.temp.interval = setInterval(function() {
        var tips_div = _amain.tips.temp.ele;
        var progress = tips_div.children[0].children[1];
        if (progress.style.width == '0%') {
          clearInterval(_amain.tips.temp.interval);
          _amain.tips.slideUp(null);
        } else {
          var persent = parseInt(progress.style.width.replace('%', ''));
          progress.style.width = (persent - 1) + '%';
        }
      }, interval);
    },
    temp: {},

  }
}
var _Jquery = {
  post: function(url, data, fun) {
    $.ajax({
      url: url,
      type: 'POST',
      data: JSON.stringify(data),
      dataType: 'json',
      contentType: 'application/json;charset=UTF-8',
      success: fun === undefined ? _Jquery.defaultProcessResult : fun
    });
  },
  get: function(url, fun) {
    $.ajax({
      url: url,
      type: 'GET',
      dataType: 'json',
      contentType: 'application/json;charset=UTF-8',
      success: fun === undefined ? _Jquery.defaultProcessResult : fun
    });
  },
  defaultProcessResult: function(result) {
    if (result.code == 100) {
      _amain.tips.open(result.msg);
    } else {
      _amain.Messager.alert(result.msg);
    }
  }
}

// constansts.js

var Constants = {
  orderStatus: {
    waitPay: {
      code: 10,
      desc: '待支付'
    },
    payTimeOut: {
      code: 11,
      desc: '支付超时'
    },
    userCancel: {
      code: 12,
      desc: '用户取消'
    },
    waitConfirm: {
      code: 20,
      desc: '待处理'
    },
    haveRecieved: {
      code: 29,
      desc: '处理中'
    },
    toProcessLive: {
      code: 17,
      desc: '待办入住'
    },
    confirmFail: {
      code: 22,
      desc: '已拒单'
    }, //确认失败等待退款
    confirmFailRefunding: {
      code: 31,
      desc: '已拒单'
    }, //31：确认失败，退款中
    refundFail: {
      code: 23,
      desc: '已拒单'
    }, //确认失败退款失败
    refunded: {
      code: 30,
      desc: '已拒单'
    }, //确认失败，已退款
    confirmed: {
      code: 21,
      desc: '可入住'
    },
     notlivein: {
      code: 41,
      desc: '未入住'
    },
    complete: {
      code: 40,
      desc: '交易完成'
    },
    changedWaitPay: {
      code: 13,
      desc: '待支付差价'
    }, //已修改，待支付差价
    changedPaying: {
      code: 27,
      desc: '支付中'
    }, //已修改，差价支付中
    changedPayed: {
      code: 14,
      desc: '已修改，待处理'
    }, //修改已确认（已支付）
    changedConfirmed: {
      code: 35,
      desc: '已修改，待处理'
    }, //35：修改已确认（无差价）
    changedWaitRefund: {
      code: 32,
      desc: '已修改，待处理'
    }, //32：修改已确认，待退款
    changedRefunding: {
      code: 33,
      desc: '已修改，待处理'
    }, //33：修改已确认，退款中
    changedRefunded: {
      code: 34,
      desc: '已修改，待处理'
    }, //34：修改已确认，已退款
    changedRefundFailed: {
      code: 24,
      desc: '已修改，待处理'
    }, //24,退款失败
    cancelRefunding: {
      code: 15,
      desc: '已取消'
    }, //已取消，退款中
    paying: {
      code: 16,
      desc: '修改中'
    }, //16:支付中等待确认
    cancelWaitRefunding: {
      code: 36,
      desc: '已取消'
    }, //36：已取消，待退款
    cancelrefunded: {
      code: 37,
      desc: '已取消'
    }, //37：已取消，已退款
    cancelrefundFailed: {
      code: 25,
      desc: '已取消'
    },
    userApplyCancel: {
      code: 18,
      desc: '买家申请取消订单'
    },
    urgent: {
      code: 119,
      desc: '紧急'
    }
  },
  orderStatusMap: { //同步自 订单状态文字_20150916.numbers
    '^10-\\d$': '待支付',
    '^11-\\d$': '支付超时',
    '^12-\\d$': '用户取消',
    '^13-\\d$': '待支付差价', //已修改，待支付差价
    '^14-\\d$': '已修改，待处理', //修改已确认（已支付）
    '^15-\\d$': '已取消', //已取消，退款中
    '^16-\\d$': '修改中', //16:支付中等待确认
    '^27-\\d$': '支付中', ////已修改，差价支付中
    '^31-\\d$': '已拒单', //31：确认失败，退款中  ---- TODO
    '^32-\\d$': '已修改，待处理', //32：修改已确认，待退款
    '^33-\\d$': '已修改，待处理', //33：修改已确认，退款中
    '^34-\\d$': '已修改，待处理', //34：修改已确认，已退款
    '^35-\\d$': '已修改，待处理', //35：修改已确认（无差价）
    '^24-\\d$': '已修改，待处理', //24：修改退款失败
    '^36-\\d$': '已取消', //36：已取消，待退款
    '^37-\\d$': '已取消', //37：已取消，已退款  ---- TODO
    '^25-\\d$': '已取消', // ---- TODO
    '^20-0$': '待处理',
    '^20-[1256]$': '修改待确认',
    '^20-[34]$': '待退差价', //
    '^29-\\d$': '处理中',
    '^21-\\d$': '可入住',
    '^41-\\d$': '未入住',
    '^17-\\d$': '待办入住',
    '^22-\\d$': '已拒单', //确认失败等待退款
    '^30-\\d$': '已拒单', //确认失败，已退款  --- TODO
    '^23-\\d$': '已拒单', //确认失败退款失败  --- TODO
    '^40-\\d$': '交易完成',
    '^18-\\d$': '买家申请取消订单'
  },
  //订单详情页渲染操作按钮使用
  orderOperateMap: { //0.开始处理 1.办理入住 2.立即确认 3.保存 4.修改订单 5.取消修改 6.提醒支付 7.拒单 8.同意取消 9.拒绝取消
    '^10-\\d$': {
      operateItem: '',
      confirmNo: false,
      liveCondition: false
    },
    '^11-\\d$': {
      operateItem: '',
      confirmNo: false,
      liveCondition: false
    },
    '^12-\\d$': {
      operateItem: '',
      confirmNo: false,
      liveCondition: false
    },
    '^13-\\d$': {
      operateItem: '5',
      confirmNo: false,
      liveCondition: false
    }, //已修改，待支付差价
    '^14-\\d$': {
      operateItem: '0247',
      confirmNo: true,
      liveCondition: false
    }, //修改已确认（已支付）
    '^15-\\d$': {
      operateItem: '',
      confirmNo: false,
      liveCondition: false
    }, //已取消，退款中
    '^16-\\d$': {
      operateItem: '',
      confirmNo: false,
      liveCondition: false
    }, //16:支付中等待确认
    '^31-\\d$': {
      operateItem: '',
      confirmNo: false,
      liveCondition: false
    }, //31：确认失败，退款中
    '^32-\\d$': {
      operateItem: '0247',
      confirmNo: true,
      liveCondition: false
    }, //32：修改已确认，待退款
    '^33-\\d$': {
      operateItem: '',
      confirmNo: false,
      liveCondition: false
    }, //33：修改已确认，退款中
    '^34-\\d$': {
      operateItem: '',
      confirmNo: false,
      liveCondition: false
    }, //34：修改已确认，已退款
    '^35-\\d$': {
      operateItem: '0247',
      confirmNo: true,
      liveCondition: false
    }, //35：修改已确认（无差价）
    '^24-\\d$': {
      operateItem: '',
      confirmNo: false,
      liveCondition: false
    }, //24：修改退款失败
    '^36-\\d$': {
      operateItem: '',
      confirmNo: false,
      liveCondition: false
    }, //36：已取消，待退款
    '^37-\\d$': {
      operateItem: '',
      confirmNo: false,
      liveCondition: false
    }, //37：已取消，已退款
    '^25-\\d$': {
      operateItem: '',
      confirmNo: false,
      liveCondition: false
    },
    '^20-0$': {
      operateItem: '027',
      confirmNo: true,
      liveCondition: false
    },
    '^20-[1256]$': {
      operateItem: '27',
      confirmNo: true,
      liveCondition: false
    },
    '^20-[34]$': {
      operateItem: '',
      confirmNo: true,
      liveCondition: false
    },
    '^29-\\d$': {
      operateItem: '247',
      confirmNo: true,
      liveCondition: false
    }, //处理中
    '^21-\\d$': {
      operateItem: '3',
      confirmNo: true,
      liveCondition: true
    },
     '^41-\\d$': {
      operateItem: '',
      confirmNo: true,
      liveCondition: true
    },
    '^17-\\d$': {
      operateItem: '1',
      confirmNo: false,
      liveCondition: true
    },
    '^27-\\d$': {
      operateItem: '',
      confirmNo: false,
      liveCondition: false
    },
    '^22-\\d$': {
      operateItem: '',
      confirmNo: false,
      liveCondition: false
    }, //确认失败等待退款
    '^30-\\d$': {
      operateItem: '',
      confirmNo: false,
      liveCondition: false
    }, //确认失败，已退款
    '^23-\\d$': {
      operateItem: '',
      confirmNo: false,
      liveCondition: false
    }, //确认失败退款失败
    '^40-\\d$': {
      operateItem: '',
      confirmNo: false,
      liveCondition: false
    },
    '^18-\\d$': {
      operateItem: '89',
      confirmNo: false,
      liveCondition: false
    }, //18. 用户申请取消订单
    '^119-\\d$': {
      operateItem: '',
      confirmNo: false,
      liveCondition: false
    }
  },
  getOrderStatus: function(status, subStatus) {
    for (var index in Constants.orderStatusMap) {
      var regExp = new RegExp(index);
      if (regExp.test(status + '-' + subStatus)) {
        return Constants.orderStatusMap[index];
      }
    }
  },
  getOperateConfig: function(status, subStatus) {
    for (var index in Constants.orderOperateMap) {
      var regExp = new RegExp(index);
      if (regExp.test(status + '-' + subStatus)) {
        return Constants.orderOperateMap[index];
      }
    }
  }
}



/**
 * 新消息提示
 * 如果有 tab且有未读消息 则渲染
 */
function checkUnreadMsg() {
  $.ajax({
    url: root + '/rest/order/getUnreadMsgCount?hotelId=0',
    type: 'GET',
    dataType: 'json',
    contentType: 'application/json;charset=UTF-8',
    success: function(result) {
      if (result.allOrder) {
        $('#order').addClass('tab-new-message-mark').attr({
          msgCount: result.allOrder
        });
      }
    },
    error: function(xhr, status, error) {
      if (status == 'timeout') {
        return;
      }
    },
    complete: function(xhr, status) {
      if (status == 'timeout') {
        return;
      }
    }
  });
}

/**
 * 初始化 head tab 为房态加链接
 */
function initHeadTab() {
  var $nav = $('#nav');
  if ($nav.length <= 0) {
    return false;
  }
  // var orderHomeUrl = "./orderList.html";
  // var roomHomeUrl = "./hotelList.html";
  // var settlementUrl = './settlement.html';
  var accountUrl = './account.html';
  // var accountHomeUrl = './accountHome.html';
  var accountTxt = '账号管理';
  // $('#order a').attr('href',orderHomeUrl);
  // $('#room a').attr('href',roomHomeUrl);
  // $('#settlement a').attr('href',settlementUrl);
  // $('#account a').attr('href',accountHomeUrl);

  // $('#nav').find('.nav-item').removeClass('nav-item-selected');
  var roleId = util.cookie.getItem('__roleId');
  // 8,10 显示结算   9不显示    8显示账号管理  9，10显示账号
  // 1:管理员;2:运营;3:编辑;4:客服;5:财务;6:发票;7:城市经理;8:供应商管理员;9:供应商销售;10:供应商财务;
  if (roleId == 8) {
    $('#settlement').removeClass('hidden');
    $('#account a').attr('href', accountUrl).html(accountTxt);
  } else if (roleId == 10) {
    $('#settlement').removeClass('hidden');
  } else {
    $('#settlement').addClass('hidden');
  }



}

window.$load = $('#common-load');
window.$wrap = $('#wrapper');
if ($wrap.length <= 0) {
  $wrap = $('body');
}
jQuery.ajaxSetup({
  cache: false,
  timeout: 30000, //超时时间设置，单位毫秒
  error: function(xhr, status, error) {
    if (status == 'timeout') { //超时,status还有success,error等值的情况
      location.replace(noPageUrl);
      return;
    }
  },
  complete: function(xhr, status) {
    if (status == 'timeout') {
      location.replace(noPageUrl);
      return;
    }
  }
});
initHeadTab();
checkUnreadMsg();

;

;(function () {
  'use strict';

  /**
   * @preserve FastClick: polyfill to remove click delays on browsers with touch UIs.
   *
   * @codingstandard ftlabs-jsv2
   * @copyright The Financial Times Limited [All Rights Reserved]
   * @license MIT License (see LICENSE.txt)
   */

  /*jslint browser:true, node:true*/
  /*global define, Event, Node*/


  /**
   * Instantiate fast-clicking listeners on the specified layer.
   *
   * @constructor
   * @param {Element} layer The layer to listen on
   * @param {Object} [options={}] The options to override the defaults
   */
  function FastClick(layer, options) {
    var oldOnClick;

    options = options || {};

    /**
     * Whether a click is currently being tracked.
     *
     * @type boolean
     */
    this.trackingClick = false;


    /**
     * Timestamp for when click tracking started.
     *
     * @type number
     */
    this.trackingClickStart = 0;


    /**
     * The element being tracked for a click.
     *
     * @type EventTarget
     */
    this.targetElement = null;


    /**
     * X-coordinate of touch start event.
     *
     * @type number
     */
    this.touchStartX = 0;


    /**
     * Y-coordinate of touch start event.
     *
     * @type number
     */
    this.touchStartY = 0;


    /**
     * ID of the last touch, retrieved from Touch.identifier.
     *
     * @type number
     */
    this.lastTouchIdentifier = 0;


    /**
     * Touchmove boundary, beyond which a click will be cancelled.
     *
     * @type number
     */
    this.touchBoundary = options.touchBoundary || 10;


    /**
     * The FastClick layer.
     *
     * @type Element
     */
    this.layer = layer;

    /**
     * The minimum time between tap(touchstart and touchend) events
     *
     * @type number
     */
    this.tapDelay = options.tapDelay || 200;

    /**
     * The maximum time for a tap
     *
     * @type number
     */
    this.tapTimeout = options.tapTimeout || 700;

    if (FastClick.notNeeded(layer)) {
      return;
    }

    // Some old versions of Android don't have Function.prototype.bind
    function bind(method, context) {
      return function() { return method.apply(context, arguments); };
    }


    var methods = ['onMouse', 'onClick', 'onTouchStart', 'onTouchMove', 'onTouchEnd', 'onTouchCancel'];
    var context = this;
    for (var i = 0, l = methods.length; i < l; i++) {
      context[methods[i]] = bind(context[methods[i]], context);
    }

    // Set up event handlers as required
    if (deviceIsAndroid) {
      layer.addEventListener('mouseover', this.onMouse, true);
      layer.addEventListener('mousedown', this.onMouse, true);
      layer.addEventListener('mouseup', this.onMouse, true);
    }

    layer.addEventListener('click', this.onClick, true);
    layer.addEventListener('touchstart', this.onTouchStart, false);
    layer.addEventListener('touchmove', this.onTouchMove, false);
    layer.addEventListener('touchend', this.onTouchEnd, false);
    layer.addEventListener('touchcancel', this.onTouchCancel, false);

    // Hack is required for browsers that don't support Event#stopImmediatePropagation (e.g. Android 2)
    // which is how FastClick normally stops click events bubbling to callbacks registered on the FastClick
    // layer when they are cancelled.
    if (!Event.prototype.stopImmediatePropagation) {
      layer.removeEventListener = function(type, callback, capture) {
        var rmv = Node.prototype.removeEventListener;
        if (type === 'click') {
          rmv.call(layer, type, callback.hijacked || callback, capture);
        } else {
          rmv.call(layer, type, callback, capture);
        }
      };

      layer.addEventListener = function(type, callback, capture) {
        var adv = Node.prototype.addEventListener;
        if (type === 'click') {
          adv.call(layer, type, callback.hijacked || (callback.hijacked = function(event) {
            if (!event.propagationStopped) {
              callback(event);
            }
          }), capture);
        } else {
          adv.call(layer, type, callback, capture);
        }
      };
    }

    // If a handler is already declared in the element's onclick attribute, it will be fired before
    // FastClick's onClick handler. Fix this by pulling out the user-defined handler function and
    // adding it as listener.
    if (typeof layer.onclick === 'function') {

      // Android browser on at least 3.2 requires a new reference to the function in layer.onclick
      // - the old one won't work if passed to addEventListener directly.
      oldOnClick = layer.onclick;
      layer.addEventListener('click', function(event) {
        oldOnClick(event);
      }, false);
      layer.onclick = null;
    }
  }

  /**
  * Windows Phone 8.1 fakes user agent string to look like Android and iPhone.
  *
  * @type boolean
  */
  var deviceIsWindowsPhone = navigator.userAgent.indexOf("Windows Phone") >= 0;

  /**
   * Android requires exceptions.
   *
   * @type boolean
   */
  var deviceIsAndroid = navigator.userAgent.indexOf('Android') > 0 && !deviceIsWindowsPhone;


  /**
   * iOS requires exceptions.
   *
   * @type boolean
   */
  var deviceIsIOS = /iP(ad|hone|od)/.test(navigator.userAgent) && !deviceIsWindowsPhone;


  /**
   * iOS 4 requires an exception for select elements.
   *
   * @type boolean
   */
  var deviceIsIOS4 = deviceIsIOS && (/OS 4_\d(_\d)?/).test(navigator.userAgent);


  /**
   * iOS 6.0-7.* requires the target element to be manually derived
   *
   * @type boolean
   */
  var deviceIsIOSWithBadTarget = deviceIsIOS && (/OS [6-7]_\d/).test(navigator.userAgent);

  /**
   * BlackBerry requires exceptions.
   *
   * @type boolean
   */
  var deviceIsBlackBerry10 = navigator.userAgent.indexOf('BB10') > 0;

  /**
   * Determine whether a given element requires a native click.
   *
   * @param {EventTarget|Element} target Target DOM element
   * @returns {boolean} Returns true if the element needs a native click
   */
  FastClick.prototype.needsClick = function(target) {
    switch (target.nodeName.toLowerCase()) {

    // Don't send a synthetic click to disabled inputs (issue #62)
    case 'button':
    case 'select':
    case 'textarea':
      if (target.disabled) {
        return true;
      }

      break;
    case 'input':

      // File inputs need real clicks on iOS 6 due to a browser bug (issue #68)
      if ((deviceIsIOS && target.type === 'file') || target.disabled) {
        return true;
      }

      break;
    case 'label':
    case 'iframe': // iOS8 homescreen apps can prevent events bubbling into frames
    case 'video':
      return true;
    }

    return (/\bneedsclick\b/).test(target.className);
  };


  /**
   * Determine whether a given element requires a call to focus to simulate click into element.
   *
   * @param {EventTarget|Element} target Target DOM element
   * @returns {boolean} Returns true if the element requires a call to focus to simulate native click.
   */
  FastClick.prototype.needsFocus = function(target) {
    switch (target.nodeName.toLowerCase()) {
    case 'textarea':
      return true;
    case 'select':
      return !deviceIsAndroid;
    case 'input':
      switch (target.type) {
      case 'button':
      case 'checkbox':
      case 'file':
      case 'image':
      case 'radio':
      case 'submit':
        return false;
      }

      // No point in attempting to focus disabled inputs
      return !target.disabled && !target.readOnly;
    default:
      return (/\bneedsfocus\b/).test(target.className);
    }
  };


  /**
   * Send a click event to the specified element.
   *
   * @param {EventTarget|Element} targetElement
   * @param {Event} event
   */
  FastClick.prototype.sendClick = function(targetElement, event) {
    var clickEvent, touch;

    // On some Android devices activeElement needs to be blurred otherwise the synthetic click will have no effect (#24)
    if (document.activeElement && document.activeElement !== targetElement) {
      document.activeElement.blur();
    }

    touch = event.changedTouches[0];

    // Synthesise a click event, with an extra attribute so it can be tracked
    clickEvent = document.createEvent('MouseEvents');
    clickEvent.initMouseEvent(this.determineEventType(targetElement), true, true, window, 1, touch.screenX, touch.screenY, touch.clientX, touch.clientY, false, false, false, false, 0, null);
    clickEvent.forwardedTouchEvent = true;
    targetElement.dispatchEvent(clickEvent);
  };

  FastClick.prototype.determineEventType = function(targetElement) {

    //Issue #159: Android Chrome Select Box does not open with a synthetic click event
    if (deviceIsAndroid && targetElement.tagName.toLowerCase() === 'select') {
      return 'mousedown';
    }

    return 'click';
  };


  /**
   * @param {EventTarget|Element} targetElement
   */
  FastClick.prototype.focus = function(targetElement) {
    var length;

    // Issue #160: on iOS 7, some input elements (e.g. date datetime month) throw a vague TypeError on setSelectionRange. These elements don't have an integer value for the selectionStart and selectionEnd properties, but unfortunately that can't be used for detection because accessing the properties also throws a TypeError. Just check the type instead. Filed as Apple bug #15122724.
    if (deviceIsIOS && targetElement.setSelectionRange && targetElement.type.indexOf('date') !== 0 && targetElement.type !== 'time' && targetElement.type !== 'month') {
      length = targetElement.value.length;
      targetElement.setSelectionRange(length, length);
    } else {
      targetElement.focus();
    }
  };


  /**
   * Check whether the given target element is a child of a scrollable layer and if so, set a flag on it.
   *
   * @param {EventTarget|Element} targetElement
   */
  FastClick.prototype.updateScrollParent = function(targetElement) {
    var scrollParent, parentElement;

    scrollParent = targetElement.fastClickScrollParent;

    // Attempt to discover whether the target element is contained within a scrollable layer. Re-check if the
    // target element was moved to another parent.
    if (!scrollParent || !scrollParent.contains(targetElement)) {
      parentElement = targetElement;
      do {
        if (parentElement.scrollHeight > parentElement.offsetHeight) {
          scrollParent = parentElement;
          targetElement.fastClickScrollParent = parentElement;
          break;
        }

        parentElement = parentElement.parentElement;
      } while (parentElement);
    }

    // Always update the scroll top tracker if possible.
    if (scrollParent) {
      scrollParent.fastClickLastScrollTop = scrollParent.scrollTop;
    }
  };


  /**
   * @param {EventTarget} targetElement
   * @returns {Element|EventTarget}
   */
  FastClick.prototype.getTargetElementFromEventTarget = function(eventTarget) {

    // On some older browsers (notably Safari on iOS 4.1 - see issue #56) the event target may be a text node.
    if (eventTarget.nodeType === Node.TEXT_NODE) {
      return eventTarget.parentNode;
    }

    return eventTarget;
  };


  /**
   * On touch start, record the position and scroll offset.
   *
   * @param {Event} event
   * @returns {boolean}
   */
  FastClick.prototype.onTouchStart = function(event) {
    var targetElement, touch, selection;

    // Ignore multiple touches, otherwise pinch-to-zoom is prevented if both fingers are on the FastClick element (issue #111).
    if (event.targetTouches.length > 1) {
      return true;
    }

    targetElement = this.getTargetElementFromEventTarget(event.target);
    touch = event.targetTouches[0];

    if (deviceIsIOS) {

      // Only trusted events will deselect text on iOS (issue #49)
      selection = window.getSelection();
      if (selection.rangeCount && !selection.isCollapsed) {
        return true;
      }

      if (!deviceIsIOS4) {

        // Weird things happen on iOS when an alert or confirm dialog is opened from a click event callback (issue #23):
        // when the user next taps anywhere else on the page, new touchstart and touchend events are dispatched
        // with the same identifier as the touch event that previously triggered the click that triggered the alert.
        // Sadly, there is an issue on iOS 4 that causes some normal touch events to have the same identifier as an
        // immediately preceeding touch event (issue #52), so this fix is unavailable on that platform.
        // Issue 120: touch.identifier is 0 when Chrome dev tools 'Emulate touch events' is set with an iOS device UA string,
        // which causes all touch events to be ignored. As this block only applies to iOS, and iOS identifiers are always long,
        // random integers, it's safe to to continue if the identifier is 0 here.
        if (touch.identifier && touch.identifier === this.lastTouchIdentifier) {
          event.preventDefault();
          return false;
        }

        this.lastTouchIdentifier = touch.identifier;

        // If the target element is a child of a scrollable layer (using -webkit-overflow-scrolling: touch) and:
        // 1) the user does a fling scroll on the scrollable layer
        // 2) the user stops the fling scroll with another tap
        // then the event.target of the last 'touchend' event will be the element that was under the user's finger
        // when the fling scroll was started, causing FastClick to send a click event to that layer - unless a check
        // is made to ensure that a parent layer was not scrolled before sending a synthetic click (issue #42).
        this.updateScrollParent(targetElement);
      }
    }

    this.trackingClick = true;
    this.trackingClickStart = event.timeStamp;
    this.targetElement = targetElement;

    this.touchStartX = touch.pageX;
    this.touchStartY = touch.pageY;

    // Prevent phantom clicks on fast double-tap (issue #36)
    if ((event.timeStamp - this.lastClickTime) < this.tapDelay) {
      event.preventDefault();
    }

    return true;
  };


  /**
   * Based on a touchmove event object, check whether the touch has moved past a boundary since it started.
   *
   * @param {Event} event
   * @returns {boolean}
   */
  FastClick.prototype.touchHasMoved = function(event) {
    var touch = event.changedTouches[0], boundary = this.touchBoundary;

    if (Math.abs(touch.pageX - this.touchStartX) > boundary || Math.abs(touch.pageY - this.touchStartY) > boundary) {
      return true;
    }

    return false;
  };


  /**
   * Update the last position.
   *
   * @param {Event} event
   * @returns {boolean}
   */
  FastClick.prototype.onTouchMove = function(event) {
    if (!this.trackingClick) {
      return true;
    }

    // If the touch has moved, cancel the click tracking
    if (this.targetElement !== this.getTargetElementFromEventTarget(event.target) || this.touchHasMoved(event)) {
      this.trackingClick = false;
      this.targetElement = null;
    }

    return true;
  };


  /**
   * Attempt to find the labelled control for the given label element.
   *
   * @param {EventTarget|HTMLLabelElement} labelElement
   * @returns {Element|null}
   */
  FastClick.prototype.findControl = function(labelElement) {

    // Fast path for newer browsers supporting the HTML5 control attribute
    if (labelElement.control !== undefined) {
      return labelElement.control;
    }

    // All browsers under test that support touch events also support the HTML5 htmlFor attribute
    if (labelElement.htmlFor) {
      return document.getElementById(labelElement.htmlFor);
    }

    // If no for attribute exists, attempt to retrieve the first labellable descendant element
    // the list of which is defined here: http://www.w3.org/TR/html5/forms.html#category-label
    return labelElement.querySelector('button, input:not([type=hidden]), keygen, meter, output, progress, select, textarea');
  };


  /**
   * On touch end, determine whether to send a click event at once.
   *
   * @param {Event} event
   * @returns {boolean}
   */
  FastClick.prototype.onTouchEnd = function(event) {
    var forElement, trackingClickStart, targetTagName, scrollParent, touch, targetElement = this.targetElement;

    if (!this.trackingClick) {
      return true;
    }

    // Prevent phantom clicks on fast double-tap (issue #36)
    if ((event.timeStamp - this.lastClickTime) < this.tapDelay) {
      this.cancelNextClick = true;
      return true;
    }

    if ((event.timeStamp - this.trackingClickStart) > this.tapTimeout) {
      return true;
    }

    // Reset to prevent wrong click cancel on input (issue #156).
    this.cancelNextClick = false;

    this.lastClickTime = event.timeStamp;

    trackingClickStart = this.trackingClickStart;
    this.trackingClick = false;
    this.trackingClickStart = 0;

    // On some iOS devices, the targetElement supplied with the event is invalid if the layer
    // is performing a transition or scroll, and has to be re-detected manually. Note that
    // for this to function correctly, it must be called *after* the event target is checked!
    // See issue #57; also filed as rdar://13048589 .
    if (deviceIsIOSWithBadTarget) {
      touch = event.changedTouches[0];

      // In certain cases arguments of elementFromPoint can be negative, so prevent setting targetElement to null
      targetElement = document.elementFromPoint(touch.pageX - window.pageXOffset, touch.pageY - window.pageYOffset) || targetElement;
      targetElement.fastClickScrollParent = this.targetElement.fastClickScrollParent;
    }

    targetTagName = targetElement.tagName.toLowerCase();
    if (targetTagName === 'label') {
      forElement = this.findControl(targetElement);
      if (forElement) {
        this.focus(targetElement);
        if (deviceIsAndroid) {
          return false;
        }

        targetElement = forElement;
      }
    } else if (this.needsFocus(targetElement)) {

      // Case 1: If the touch started a while ago (best guess is 100ms based on tests for issue #36) then focus will be triggered anyway. Return early and unset the target element reference so that the subsequent click will be allowed through.
      // Case 2: Without this exception for input elements tapped when the document is contained in an iframe, then any inputted text won't be visible even though the value attribute is updated as the user types (issue #37).
      if ((event.timeStamp - trackingClickStart) > 100 || (deviceIsIOS && window.top !== window && targetTagName === 'input')) {
        this.targetElement = null;
        return false;
      }

      this.focus(targetElement);
      this.sendClick(targetElement, event);

      // Select elements need the event to go through on iOS 4, otherwise the selector menu won't open.
      // Also this breaks opening selects when VoiceOver is active on iOS6, iOS7 (and possibly others)
      if (!deviceIsIOS || targetTagName !== 'select') {
        this.targetElement = null;
        event.preventDefault();
      }

      return false;
    }

    if (deviceIsIOS && !deviceIsIOS4) {

      // Don't send a synthetic click event if the target element is contained within a parent layer that was scrolled
      // and this tap is being used to stop the scrolling (usually initiated by a fling - issue #42).
      scrollParent = targetElement.fastClickScrollParent;
      if (scrollParent && scrollParent.fastClickLastScrollTop !== scrollParent.scrollTop) {
        return true;
      }
    }

    // Prevent the actual click from going though - unless the target node is marked as requiring
    // real clicks or if it is in the whitelist in which case only non-programmatic clicks are permitted.
    if (!this.needsClick(targetElement)) {
      event.preventDefault();
      this.sendClick(targetElement, event);
    }

    return false;
  };


  /**
   * On touch cancel, stop tracking the click.
   *
   * @returns {void}
   */
  FastClick.prototype.onTouchCancel = function() {
    this.trackingClick = false;
    this.targetElement = null;
  };


  /**
   * Determine mouse events which should be permitted.
   *
   * @param {Event} event
   * @returns {boolean}
   */
  FastClick.prototype.onMouse = function(event) {

    // If a target element was never set (because a touch event was never fired) allow the event
    if (!this.targetElement) {
      return true;
    }

    if (event.forwardedTouchEvent) {
      return true;
    }

    // Programmatically generated events targeting a specific element should be permitted
    if (!event.cancelable) {
      return true;
    }

    // Derive and check the target element to see whether the mouse event needs to be permitted;
    // unless explicitly enabled, prevent non-touch click events from triggering actions,
    // to prevent ghost/doubleclicks.
    if (!this.needsClick(this.targetElement) || this.cancelNextClick) {

      // Prevent any user-added listeners declared on FastClick element from being fired.
      if (event.stopImmediatePropagation) {
        event.stopImmediatePropagation();
      } else {

        // Part of the hack for browsers that don't support Event#stopImmediatePropagation (e.g. Android 2)
        event.propagationStopped = true;
      }

      // Cancel the event
      event.stopPropagation();
      event.preventDefault();

      return false;
    }

    // If the mouse event is permitted, return true for the action to go through.
    return true;
  };


  /**
   * On actual clicks, determine whether this is a touch-generated click, a click action occurring
   * naturally after a delay after a touch (which needs to be cancelled to avoid duplication), or
   * an actual click which should be permitted.
   *
   * @param {Event} event
   * @returns {boolean}
   */
  FastClick.prototype.onClick = function(event) {
    var permitted;

    // It's possible for another FastClick-like library delivered with third-party code to fire a click event before FastClick does (issue #44). In that case, set the click-tracking flag back to false and return early. This will cause onTouchEnd to return early.
    if (this.trackingClick) {
      this.targetElement = null;
      this.trackingClick = false;
      return true;
    }

    // Very odd behaviour on iOS (issue #18): if a submit element is present inside a form and the user hits enter in the iOS simulator or clicks the Go button on the pop-up OS keyboard the a kind of 'fake' click event will be triggered with the submit-type input element as the target.
    if (event.target.type === 'submit' && event.detail === 0) {
      return true;
    }

    permitted = this.onMouse(event);

    // Only unset targetElement if the click is not permitted. This will ensure that the check for !targetElement in onMouse fails and the browser's click doesn't go through.
    if (!permitted) {
      this.targetElement = null;
    }

    // If clicks are permitted, return true for the action to go through.
    return permitted;
  };


  /**
   * Remove all FastClick's event listeners.
   *
   * @returns {void}
   */
  FastClick.prototype.destroy = function() {
    var layer = this.layer;

    if (deviceIsAndroid) {
      layer.removeEventListener('mouseover', this.onMouse, true);
      layer.removeEventListener('mousedown', this.onMouse, true);
      layer.removeEventListener('mouseup', this.onMouse, true);
    }

    layer.removeEventListener('click', this.onClick, true);
    layer.removeEventListener('touchstart', this.onTouchStart, false);
    layer.removeEventListener('touchmove', this.onTouchMove, false);
    layer.removeEventListener('touchend', this.onTouchEnd, false);
    layer.removeEventListener('touchcancel', this.onTouchCancel, false);
  };


  /**
   * Check whether FastClick is needed.
   *
   * @param {Element} layer The layer to listen on
   */
  FastClick.notNeeded = function(layer) {
    var metaViewport;
    var chromeVersion;
    var blackberryVersion;
    var firefoxVersion;

    // Devices that don't support touch don't need FastClick
    if (typeof window.ontouchstart === 'undefined') {
      return true;
    }

    // Chrome version - zero for other browsers
    chromeVersion = +(/Chrome\/([0-9]+)/.exec(navigator.userAgent) || [,0])[1];

    if (chromeVersion) {

      if (deviceIsAndroid) {
        metaViewport = document.querySelector('meta[name=viewport]');

        if (metaViewport) {
          // Chrome on Android with user-scalable="no" doesn't need FastClick (issue #89)
          if (metaViewport.content.indexOf('user-scalable=no') !== -1) {
            return true;
          }
          // Chrome 32 and above with width=device-width or less don't need FastClick
          if (chromeVersion > 31 && document.documentElement.scrollWidth <= window.outerWidth) {
            return true;
          }
        }

      // Chrome desktop doesn't need FastClick (issue #15)
      } else {
        return true;
      }
    }

    if (deviceIsBlackBerry10) {
      blackberryVersion = navigator.userAgent.match(/Version\/([0-9]*)\.([0-9]*)/);

      // BlackBerry 10.3+ does not require Fastclick library.
      // https://github.com/ftlabs/fastclick/issues/251
      if (blackberryVersion[1] >= 10 && blackberryVersion[2] >= 3) {
        metaViewport = document.querySelector('meta[name=viewport]');

        if (metaViewport) {
          // user-scalable=no eliminates click delay.
          if (metaViewport.content.indexOf('user-scalable=no') !== -1) {
            return true;
          }
          // width=device-width (or less than device-width) eliminates click delay.
          if (document.documentElement.scrollWidth <= window.outerWidth) {
            return true;
          }
        }
      }
    }

    // IE10 with -ms-touch-action: none or manipulation, which disables double-tap-to-zoom (issue #97)
    if (layer.style.msTouchAction === 'none' || layer.style.touchAction === 'manipulation') {
      return true;
    }

    // Firefox version - zero for other browsers
    firefoxVersion = +(/Firefox\/([0-9]+)/.exec(navigator.userAgent) || [,0])[1];

    if (firefoxVersion >= 27) {
      // Firefox 27+ does not have tap delay if the content is not zoomable - https://bugzilla.mozilla.org/show_bug.cgi?id=922896

      metaViewport = document.querySelector('meta[name=viewport]');
      if (metaViewport && (metaViewport.content.indexOf('user-scalable=no') !== -1 || document.documentElement.scrollWidth <= window.outerWidth)) {
        return true;
      }
    }

    // IE11: prefixed -ms-touch-action is no longer supported and it's recomended to use non-prefixed version
    // http://msdn.microsoft.com/en-us/library/windows/apps/Hh767313.aspx
    if (layer.style.touchAction === 'none' || layer.style.touchAction === 'manipulation') {
      return true;
    }

    return false;
  };


  /**
   * Factory method for creating a FastClick object
   *
   * @param {Element} layer The layer to listen on
   * @param {Object} [options={}] The options to override the defaults
   */
  FastClick.attach = function(layer, options) {
    return new FastClick(layer, options);
  };


  if (typeof define === 'function' && typeof define.amd === 'object' && define.amd) {

    // AMD. Register as an anonymous module.
    define(function() {
      return FastClick;
    });
  } else if (typeof module !== 'undefined' && module.exports) {
    module.exports = FastClick.attach;
    module.exports.FastClick = FastClick;
  } else {
    window.FastClick = FastClick;
  }
}());
