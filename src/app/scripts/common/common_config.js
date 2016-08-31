// 模板doT配置
doT.templateSettings = {
  evaluate:    /\<\%([\s\S]+?)\%\>/g,
  interpolate: /\<\%=([\s\S]+?)\%\>/g,
  varname: 'it'
};


// config_new.js
var _config={};
var ctx = '/supplier';
/**
 * 每个页面必须的一步
 */
_config.isWx = navigator.userAgent.indexOf('MicroMessenger/')!=-1 ? true : false;
if(true){
  var root = location.origin+ctx;
} else {
  var root = 'https://hotel-test.rsscc.com'+ctx;
}
var noPageUrl = './404.html';