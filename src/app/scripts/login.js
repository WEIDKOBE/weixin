
function init(){
  //1. 缓存参数
  _params = getUrlParams();

  //2. 绑定验证码发送事件
  bindVerifyCodeEvent();

  //3. 绑定登录事件
  bindLogin();

  $load.addClass('hidden');
  $wrap.addClass('show');

}
init();

function bindVerifyCodeEvent(){
  $('.send-button').click(sendVerifyCode);
}

function sendVerifyCode(){
  //2. 显示提示信息调用发送验证码接口
  var phoneNum = validatePhoneNum();
  if(phoneNum){
    //1. 禁用点击事件
    $('.send-button').off('click');
    $.ajax({
      url:root + '/rest/supplier/sendVerifyCode',
      type: 'POST',
      data: JSON.stringify({phone:phoneNum}),
      dataType: 'json',
      contentType:'application/json;charset=UTF-8',
      success: function(result) {
        if(result.code==100){
          //显示发送成功文字
          $('#error-phone').html("<span style='color:rgb(2,179,207)'>已发送验证码短信，请查收！</span>");
          //改变按钮文字，倒数60秒恢复点击
          _params._time=60;
          sendButton();
        }else{
          $('#error-phone').html(result.msg);
          $('.send-button').click(sendVerifyCode);
        }
      }
    });
  }
}

function sendButton(){
  $('.send-button').html(_params._time--+"秒后重发");
  if(_params._time<0){
    $('.send-button').click(sendVerifyCode);
    $('.send-button').html("发送验证码");
  }else{
    setTimeout(sendButton,1000);
  }
}

/**
 * 绑定登录事件
 */
function bindLogin(){
  $('#login').click(login);
  $('#confirm-button').click(function(){
    login(true);
  });
  $('#cancel-button').click(function(){
    $('#confirm-window').hide();
  });
}

/**
 *
 */
function login(flag){
  //验证并缓存参数
  if(!isvalid())return;
  $load.removeClass('hidden');
  if(flag===true){
    _params.loginParam.forceLogin=true;
  }
  $.ajax({
    url:root + '/rest/supplier/login',
    type: 'POST',
    data: JSON.stringify(_params.loginParam),
    dataType: 'json',
    contentType:'application/json;charset=UTF-8',
    success: function(result) {
      processLogin(result);
    }
  });
}

/**
 * 验证登录信息是否正确
 * @returns {Boolean}
 */
function isvalid(){
  var phoneNum = validatePhoneNum();
  var code = validateCode();
  if(!phoneNum || !code){
    return false;
  }
  _params.loginParam={
      "phone":phoneNum,
      "verificationCode":code,
      "forceLogin":false
  }
  return true;
}
//1.验证电话号
function validatePhoneNum(){
  var phoneNum = $('#phone').val();

  if(!(/^1[3578]\d{9}$/.test(phoneNum))){
    $('#error-phone').html('请输入11位手机号码！');
    return false;
  }
  $('#error-phone').html('');
  return phoneNum;
}
//2.验证验证码
function validateCode(){
  var code = $('#verificationCode').val();

  if(!(/^\d{6}$/.test(code))){
    $('#error-code').html("请输入6位数字验证码！");
    return false;
  }
  $('#error-code').html('');
  return code;
}


/**
 * 处理登录
 */
function processLogin(result){
//  alert(JSON.stringify(result));
  switch(result.code){
    case 100:{
      util.cookie.setItem('__roleId',result.roleId);
      util.cookie.setItem("_supplierId",result.id)
      saveCookie();
      break;
    }case 301:{
      $load.addClass('hidden');
      $('#error-phone').html(result.msg);
      break;
    }case 302:{
      $load.addClass('hidden');
      $('#error-code').html(result.msg);
      break;
    }case 303:{
      $load.addClass('hidden');
      $('#confirm-window').show();
    }default:
      $load.addClass('hidden');
  }
}
/**
 * 保存供应商类型
 */
function saveCookie(){
  $.ajax({
    url:root + '/rest/supplier/getAccountInfo',
      type: 'GET',
      dataType: 'json',
      contentType:'application/json;charset=UTF-8',
      success: function(result) {
        util.cookie.setItem('supplier_type',result.type);
        util.cookie.setItem('__id',result.id);
        var url = './orderList.html';
        location.replace(url);
      }
  });
}
/**
 * 登录返回代码
 * public static final int LOGIN_SUCCESS=100;//登录成功
  public static final int LOGIN_NO_PHONE=301;//手机号未注册
  public static final int LOGIN_ERROR_VERI_CODE=302;//验证码错误
  public static final int LOGIN_BIND_OTHER_WX=303;//此账号已于其他微信号绑定

  public static final String CODE_301="手机号未注册！";
  public static final String CODE_302="验证码错误！";
  public static final String CODE_303="此账号已于其他微信号绑定，继续登录将会解除其绑定。";
 */
var loginMsg = {
    'code_100':{
      status:'ok'
    },
    'code_301':{
      status:'error',
      errorMsg:'手机号未注册！'
    },
    'code_302':{
      status:'error',
      errorMsg:'验证码错误！'
    },
    'code_303':{
      status:'warn',
      errorMsg:'此账号已于其他微信号绑定，继续登录将会解除其绑定。'
    }
}