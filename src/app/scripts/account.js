(function(win){
  var account = {
    initUerInfo: true,
    initManagerAccountInfo:true,
    // 角色  dataRole 财务 10  销售 9
    dataRole : {
      seller: [],
      finance: [],
      other: []
    },
    tabSwitch: function(){
      var self = this;
      // 标签切换
      var $tabs = $('#ptabs');
      var $tab = $('#ptabs').find('.ptab');
      var $list = $('#app').find('.plist');
      $tabs.on('click','.ptab',function(){
        $(this).addClass('pselect').siblings('.ptab').removeClass('pselect');
        var idx = $tab.index($(this));
        $list.hide();
        $list.eq(idx).show();
        util.storage.setItem('__ptabIndx', idx);

        if(self.initUerInfo && $(this).is('#ptabuser')){
          self.initUerInfo = false;
          self.getUserInfo();
        } else if(self.initManagerAccountInfo && $(this).is('#ptabmanager')){
          self.initManagerAccountInfo = false;
          self.managerAccountInfo();
        }
      });
      var ptabIndx = util.storage.getItem('__ptabIndx') || 0;
      $tab.eq(ptabIndx).trigger('click');
    },
    // 获取我的信息
    getUserInfo: function(){
      var self = this;
      $load.removeClass('hidden');
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
            $('#puser .pitem').hide();
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
          //$('#modifyName').on('click',function(){
          //  var info ={
          //    name: $(this).data('name'),
          //    tel: $(this).data('tel')
          //  }
          //  util.goByUrl('./accountModifyName.html?info='+JSON.stringify(info));
          //});
          //
          //// 修改电话
          //$('#modifyPhone').on('click',function(){
          //  var info ={
          //    name: $(this).data('name'),
          //    tel: $(this).data('tel')
          //  }
          //  util.goByUrl('./accountModifyPhone.html?info='+JSON.stringify(info));
          //});

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

          $load.addClass('hidden');
          $wrap.addClass('show');
        } 
      });
    },
    // 获取管理其他账号
    managerAccountInfo: function(){
      var self = this;
      var dataRole = self.dataRole;
      $load.removeClass('hidden');
      $.ajax({  
        url:root + '/rest/supplier/getEmployee',
        type: 'GET', 
        dataType: 'json',
        contentType:'application/json;charset=UTF-8',        
        success: function(data) { 
          // console.log(data);
          var accounts = data.accounts;

          for(var i=0; i<accounts.length; i++){
            var account = accounts[i];
            var roleId = account.roleId;
            if(roleId == 9){
              dataRole.seller.push(account);
            } else if(roleId == 10){
              dataRole.finance.push(account);
            } else {
              dataRole.other.push(account);
            }
          }

          var tmpl = $('#pmangerTmpl').html();
          var render = doT.template(tmpl);
          var html = render(dataRole);
          $('#pmanger').html(html);
          // 添加/修改财务
          $('.cw').on('click', function(){
            var info = {
              title: '添加财务',
              name: $(this).data('name'),
              tel: $(this).data('tel'),
              id: $(this).data('id'),
              roleId: $(this).data('roleid') || 10
            }
            util.goByUrl('./accountAdd.html?info='+JSON.stringify(info));
          });
          // 添加销售
          $('#psellAdd').on('click', function(){
            var info = {
              title: '添加销售',
              roleId: 9
            }
            util.goByUrl('./accountAdd.html?info='+JSON.stringify(info));
          });

          // 查看销售
          $("#psellTable").on('click','.psellItem',function(){
            var info = JSON.stringify({
              id: $(this).data('id'),
              roleId: $(this).data('roleid')
            });
            util.goByUrl('./accountSeller.html?info='+info);
          });

          $load.addClass('hidden');
          $wrap.addClass('show');
        } 
      });
    },
    realLoginOut: function(){
      var self = this;
      $load.removeClass('hidden');
      $.ajax({  
        url:root + '/rest/supplier/logout',
          type: 'GET', 
          dataType: 'json',
          contentType:'application/json;charset=UTF-8',        
          success: function(result) { 
            if(result){
              util.cookie.removeItem('__id');
              util.cookie.removeItem('supplier_type');
              // util.cookie.removeItem('__roleId');
              util.goByUrl('./login.html');
            }else{
              $load.addClass('hidden');
              alert('退出失败');
            }
          } 
      });
    },
    initOther: function(){
      var self = this;

      $('.common-msg-cancel').on('click', function(){
        util.messageBox.hide();
      });

      $('.common-msg-ok').on('click', function(){
        util.messageBox.hide();
        self.realLoginOut();
      });
      // 退出登录
      $("#ploginout").on('click', function(){
        util.messageBox();
      });
    },
    init: function(){
      var self = this;
      self.tabSwitch();
      self.initOther();
    }
  }
  account.init();
})(window);