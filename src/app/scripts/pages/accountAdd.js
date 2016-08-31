/*
* @Author: WD
* @Date:   2016-06-24 09:23:59
* @Last Modified by:   WD
* @Last Modified time: 2016-06-24 09:24:39
*/

'use strict';

 !function(win) {
      var accountAdd = {
        getParams: function() {
          var self = this;
          self.info = util.getParam(util.getQueryString("info"));
        },
        initOther: function() {
          var self = this, info = self.info;
          $load.addClass("hidden");
          // $("#pHeadArrow").on("click", function() {
          //     history.back()
          // });
          // $("#pHeadTitle").html(info.title);
          util.updateTitle(info.title);
        },
        bindEvent: function() {
          var self = this, info = self.info;
          info.name && $("#pmInput").val(info.name);
          var tel = info.tel;
          util.validateTel(tel) || $("#pmInputTel").val(tel),
          $("#pmInput")[0].focus();
          var url = "/rest/supplier/addEmployee";
          var data = {};
          if(info.id){
            url = "/rest/supplier/updateEmployee";
            data.id = info.id;
          };
          $("#pmBtnSave").on("click", function() {
            var nameVal = $("#pmInput").val().trim()
              , telVal = $("#pmInputTel").val().trim();
            if(!nameVal){
              alert("姓名不能为空");
              return;
            }
            if(util.validateTel(telVal)){
              alert("手机号为空或格式不正确");
              return;
            }
            $load.removeClass("hidden");
            util.extend(data, {
              roleId: info.roleId,
              name: nameVal,
              phone: telVal
            }),
            $.ajax({
              type: "GET",
              url: root + url,
              data: data,
              dataType: "json",
              contentType: "application/json;charset=UTF-8",
              success: function(data) {
                if(data.returnCode == 100){
                   history.back();
                } else {
                  $load.addClass("hidden");
                  alert(data.comment || "添加失败");
                }

                // util.messageBoxTips();
                // $("#common-msg-btn").on("click", function() {
                //   util.messageBox.hide();

                // })
              }
            })
          }),
          $("#pmBtnCancel").on("click", function() {
            history.back()
          })
        },
        init: function() {
          var self = this;
          self.getParams();
          self.initOther();
          self.bindEvent();
        }
      };
      accountAdd.init();
    }(window);