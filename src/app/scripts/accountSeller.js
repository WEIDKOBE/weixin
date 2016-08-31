(function(win){
  var accountSeller = {
    getParams: function(){
      var self = this;
      var info = util.getParam(util.getQueryString('info'));
      self.info = info;
      return info;
    },
    getData: function(){
      var self = this;
      var info = self.info;
      $.ajax({  
        url:root + '/rest/supplier/getEmployeeDetail',
        type: 'GET', 
        dataType: 'json',
        contentType:'application/json;charset=UTF-8',
        data: {
          id:info.id,
          roleId:info.roleId
        },
        success: function(result) {
          // alert(JSON.stringify(result));
          self.info.name = result.name;
          self.info.tel = result.phone;
          self.info.hotelCount = result.hotelCount;

          $('#pname').html(result.name);
          $('#delSellerTitle').html('要删除销售'+result.name+'吗？');

          $('#ptel').html(result.phone);
          $('#photel').html(result.hotelCount || 0);
          // 下班为2，上班为1
          if(result.isworking==1){
            $('#switcha').addClass('switcha-on');
          }else{
            $('#switcha').removeClass('switcha-on');
          }

          // 隐藏loading
          $load.addClass('hidden');
        } 
      });
    },
    bindEvent: function(){
      var self = this;
      var info = self.info;
      // 上下班  2 下班  1上班
      $('#switcha').on('click', function(){
        var isworking = 1;
        if($('#switcha').hasClass('switcha-on')){
          isworking = 2;
        }
        $.ajax({  
          url:root + '/rest/supplier/updateEmployeeWorking',
          type: 'GET', 
          data: {
            id: info.id,
            roleId: info.roleId,
            isWorking: isworking
          },
          contentType:'application/json;charset=UTF-8',
          success: function(result) { 
            if(result.returnCode==100){
              if(isworking == 1){
                $('#switcha').addClass('switcha-on');
              } else {
                $('#switcha').removeClass('switcha-on');
              }
              
              _amain.tips.open('操作成功');
            }else{
              _amain.Messager.alert('操作失败');
            }
          } 
        });
      })

      // 删除销售
      $('#bthDeleteSeller').on('click', function(){
        util.messageBox();
      })

      $('.common-msg-cancel').on('click', function(){
        util.messageBox.hide();
      });

      $('.common-msg-ok').on('click', function(){
        util.messageBox.hide();
        self.realDelSeller();
      });


      // 修改姓名
      $('#modifyName').on('click',function(){
        var paraminfo ={
          name: info.name,
          tel: info.tel,
          id: info.id
        }
        util.goByUrl('./accountModifyName.html?info='+JSON.stringify(paraminfo));
      });

      // 修改电话
      $('#modifyPhone').on('click',function(){
        var paraminfo ={
          name: info.name,
          tel: info.tel,
          id: info.id
        }
        util.goByUrl('./accountModifyPhone.html?info='+JSON.stringify(paraminfo));
      });

      // 查看房态
      $('#lookRoomStatus').on('click',function(){
        var paraminfo ={
          id: info.id,
          roleId: info.roleId,
          name: info.name
        }
        util.goByUrl('./accountOperationHotel.html?info='+JSON.stringify(paraminfo));
      });
    },
    realDelSeller:function(){
      var self = this;
      var info = self.info;
      
      $.ajax({  
          url:root + '/rest/supplier/delEmployee',
          type: 'GET', 
          data: {
            id: info.id,
            roleId: info.roleId
          },
          contentType:'application/json;charset=UTF-8',
          success: function(result) { 
            if(result.returnCode ==100){
              // util.messageBoxTips();
              // $('#common-msg-btn').on('click', function(){
              //   util.messageBox.hide();
              //   alert('删除成功');
                
              // });
              history.back();
            }else{
              alert('删除失败');
            }
          } 
        });
    },
    tabSwitch: function(){
      var self = this;
      // 最近一个月  最近三个月  区别
      self.initOne = true;
      self.initThree = true;
      self.initAll = true;
      self.$pload = $("#ptableLoading");
      // 标签切换
      var $tabs = $('#ptabs');
      var $tab = $('#ptabs').find('.ptab');
      self.isLoadingSeller = false;
      $tabs.on('click','.ptab',function(){
        if(self.isLoadingSeller) return;
        $(this).addClass('pselect').siblings('.ptab').removeClass('pselect');
        var idx = $tab.index($(this));
        if(idx == 0 && self.initOne){
          self.getAchieve(1);
        } else if(idx == 1 && self.initThree){
          self.getAchieve(3);
        } else if(idx == 2 && self.initAll) {
          self.getAchieve(100);
        }
        util.storage.setItem('__psellerTabIndx', idx);
      });
      var ptabIndx = util.storage.getItem('__psellerTabIndx');
      $tab.eq(ptabIndx).trigger('click');
    },
    getAchieve: function(type){
      var self = this;
      self.isLoadingSeller = true;
      self.$pload.show();
      var info = self.info;
      $.ajax({  
        url:root + '/rest/supplier/getAchieve',
        type: 'GET', 
        data: {
          id: info.id,
          queryType: type
        },
        contentType:'application/json;charset=UTF-8',
        success: function(result) { 
          if(result.returnCode ==100){
            if(type == 1){
              self.initOne = false;
            } else if(type == 3){
              self.initThree = false;
            } else if(type == 100) {
              self.initAll = false;
            }
            
            self.isLoadingSeller = false;
            var supplier = result.supplier;
            var average = result.average;
            var best = result.best;
            
            if(!supplier.averageConfirmRate){
              supplier.averageConfirmRate = 0;
            } else {
              supplier.averageConfirmRate = (supplier.averageConfirmRate-0).toFixed(2);
            }
            if(supplier.countReceiveOrder){
              supplier.orderTotalPrice = supplier.orderTotalPrice || 0;
              supplier.averagePrice = (supplier.orderTotalPrice/supplier.countReceiveOrder).toFixed(2);
            } else {
              supplier.countReceiveOrder = 0;
              supplier.averagePrice = 0;
              supplier.orderTotalPrice = supplier.orderTotalPrice || 0;
            }

            if(!average.averageConfirmRate){
              average.averageConfirmRate = 0;
            } else {
              average.averageConfirmRate = (average.averageConfirmRate-0).toFixed(2);
            }
            if(average.countReceiveOrder){
              average.orderTotalPrice = average.orderTotalPrice || 0;
              average.averagePrice = (average.orderTotalPrice/average.countReceiveOrder).toFixed(2);
            } else {
              average.countReceiveOrder = 0;
              average.averagePrice = 0;
              average.orderTotalPrice = average.orderTotalPrice || 0;
            }

            if(!best.averageConfirmRate){
              best.averageConfirmRate = 0;
            } else {
              best.averageConfirmRate = (best.averageConfirmRate-0).toFixed(2);
            }
            if(best.countReceiveOrder){
              best.orderTotalPrice = best.orderTotalPrice || 0;
              best.averagePrice = (best.orderTotalPrice/best.countReceiveOrder).toFixed(2);
            } else {
              best.countReceiveOrder = 0;
              best.averagePrice = 0;
              best.orderTotalPrice = best.orderTotalPrice || 0;
            }

            result.supplier = supplier;
            result.average = average;
            result.best = best;
            // console.log(result);
            var tmpl = $('#ptbodyTmpl').html();
            var render = doT.template(tmpl);
            var html = render(result);
            $('#ptableBox').html(html);
            self.$pload.hide();
          }else{
            self.$pload.hide();
            self.isLoadingSeller = false;
            alert("获取数据失败");
          }
        } 
      });
    },
    init: function(){
      var self = this;
      self.getParams();
      self.getData();
      self.bindEvent();
      self.tabSwitch();
    }
  }
  accountSeller.init();

})(window);