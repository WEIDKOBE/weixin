(function(win){
  var accountOperationHotel = {
    getParams: function(){
      return util.getParam(util.getQueryString('info'));
    },
    getData: function(info){
      var self = this;
      $.ajax({  
        url:root + '/rest/hotel/getSupplierHotels',
        type: 'GET', 
        dataType: 'json',
        contentType:'application/json;charset=UTF-8',
        data: {
          id:info.id,
          roleId:info.roleId
        },
        success: function(result) {
          // console.log(result);
          var data = self.processData(result);
          self.render(data);
          self.bindEvent();
          // 隐藏loading
          $load.addClass('hidden');
        } 
      });
    },
    processData: function(result){
      var self = this;
      var data = {
        assignedHotel:[],
        unAssignedHotel:[],
        selfHotel:[]
      };
      for(var i=0,len=result.length; i<len; i++){
        var hotel = result[i];
        if( hotel.distributed ){
          if(hotel.salesId == self.info.id){
            hotel.selected = true;
            data.selfHotel.push(hotel);
          }
        } else {
          data.unAssignedHotel.push(hotel);
        }
      }
      return data;
    },
    render: function(data){
      var untmpl = $('#unAssignedHotelTmpl').html();
      var render = doT.template(untmpl);
      var html_un = render(data);
      $('#unAssignedHotel').html(html_un);
      //var tmpl = $('#assignedHotelTmpl').html();
      //var render = doT.template(tmpl);
      //var html = render(data.assignedHotel);
      //$('#assignedHotel').html(html);
    },
    bindEvent: function(){
      var self = this;
      // 添加/删除酒店
      $('.aohList').on('click', '.aohItem', function(){
        var aohIcon= $(this).find('.aohIcon');
        if(aohIcon.hasClass('aohIconSelect')){
          aohIcon.removeClass('aohIconSelect');
        } else {
          aohIcon.addClass('aohIconSelect');
        }
      });
      // 保存
      $('#btn_save').on('click', function(){
        util.messageBox();
      });

      $('.common-msg-cancel').on('click', function(){
        util.messageBox.hide();
      });

      $('.common-msg-ok').on('click', function(){
        util.messageBox.hide();
        self.saveHotel();
      });
    },
    saveHotel: function(){
      var self = this;
      $load.removeClass('hidden');
      var info = self.info;
      var hids = '';
      $('#app').find('.aohIconSelect').each(function(i,val){
        var id = $(val).data('hotelid');
        if(id){
          hids += (',' + id);
        }
      });

      $.ajax({  
        url:root + '/rest/supplier/updateEmployeeHotels',
        type: 'GET', 
        dataType: 'json',
        contentType:'application/json;charset=UTF-8',
        data: {
          id:info.id,
          roleId:info.roleId,
          hotelIds:hids.slice(1)
        },
        success: function(result) {
          // console.log(result);
          if(result.returnCode = 100){
            // alert('提交成功');
            history.back();
          } else {
            $load.addClass('hidden');
            alert('提交失败');
          }
          // history.back();
          // 隐藏loading
          // $load.addClass('hidden');
        } 
      });
    },
    initOthor: function(info){
      // $('#pHeadArrow').on('click',function(){history.back()});
      // $('#pHeadTitle').html(info.name + "·添加/删除酒店");
      util.updateTitle(info.name + "·添加/删除酒店");
    },
    init: function(){
      var self = this;
      var info = self.getParams();
      self.info = info;
      self.getData(info);
      self.initOthor(info);
    }
  }
  accountOperationHotel.init();
})(window);