(function(win){
  var accountHome = {
    //2. 获取账号信息
    getAccountInfo: function(){
      $.ajax({  
        url:root + '/rest/supplier/getAccountInfo',
          type: 'GET', 
          dataType: 'json',
          contentType:'application/json;charset=UTF-8',        
          success: function(result) { 
            util.cookie.setItem('__id',result.id);
            util.cookie.setItem('__roleId',result.roleId);
            
            $('#pname').html(result.name);
            $('#ptel').html(result.phone);
            $('#modifyName').data('name',result.name);
            $('#modifyName').data('tel',result.phone);
            $('#modifyPhone').data('name',result.name);
            $('#modifyPhone').data('tel',result.phone);
            if(!result.cityManagerPhone && !result.cityManagerName){
              $('#pcitynamebox').hide();
              $('#pcitytelbox').hide();
              $('.pitem').hide();
            } else if(!result.cityManagerPhone){
              $('#pcityname').html(result.cityManagerName);
              $('#pcitytelbox').hide();
            } else {
              $('#pcityname').html(result.cityManagerName);
              $('#pcitytel').html(result.cityManagerPhone);
              $('#pGoTel').data('tel',result.cityManagerPhone);
            }

            if(result.isworking==1){
              $('#switcha').addClass('switcha-on');
            }else{
              $('#switcha').removeClass('switcha-on');
            }

            // 打电话
            $('#pGoTel').on('click',function(){
              var tel = $(this).data('tel');
              win.location.href = "tel://" + tel;
            });

            // 修改姓名
            // $('#modifyName').on('click',function(){
            //   var info ={
            //     name: $(this).data('name'),
            //     tel: $(this).data('tel')
            //   }
            //   util.goByUrl('./accountModifyName.html?info='+JSON.stringify(info));
            // });

            // 修改电话
            // $('#modifyPhone').on('click',function(){
            //   var info ={
            //     name: $(this).data('name'),
            //     tel: $(this).data('tel')
            //   }
            //   util.goByUrl('./accountModifyPhone.html?info='+JSON.stringify(info));
            // });

            $load.addClass('hidden');
            $wrap.addClass('show');
          } 
      });
    },
    //3. 退出登录
    logout: function(){
      $('#ploginout').on('click', function(){
        $load.removeClass('hidden');
        $.ajax({  
          url:root + '/rest/supplier/logout',
            type: 'GET', 
            dataType: 'json',
            contentType:'application/json;charset=UTF-8',        
            success: function(result) { 
              if(result){
                $load.addClass('hidden');
                util.cookie.removeItem('__id');
                util.cookie.removeItem('supplier_type');
                // util.cookie.removeItem('__roleId');
                util.goByUrl('./login.html');
              }else{
                alert('退出失败');
              }
            } 
        });
      });
    },
    //4. 跳转结算页面
    gotoSettlement: function(){
      $('#goSettlement').on('click',function(){
        util.goByUrl('./settlement.html');
      });
    },
    //5. 绑定上下班操作
    bindWorkSwitch: function(){
      $('#switcha').on('click', function(){
        if($(this).hasClass('switcha-on')){
          _Jquery.get(root+'/rest/supplier/stopWork',function(result){
            if(result.code==100){
              $('#switcha').removeClass('switcha-on');
              _amain.tips.open(result.msg);
            }else{
              _amain.Messager.alert(result.msg);
            }
          });
        }else{
          _Jquery.get(root+'/rest/supplier/startWork',function(result){
            if(result.code==100){
              $('#switcha').addClass('switcha-on');
              _amain.tips.open(result.msg);
            }else{
              _amain.Messager.alert(result.msg);
            }
          });
        }
      });
    },
    init: function(){
      var self = this;
      self.getAccountInfo();
      self.logout();
      self.gotoSettlement();
      self.bindWorkSwitch();
    }
  }
  accountHome.init();
})(window);