/*
* @Author: WD
* @Date:   2016-06-29 13:49:58
* @Last Modified by:   WD
* @Last Modified time: 2016-06-29 13:50:25
*/

'use strict';

 !function(win) {
      var accountModifyPhone = {
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
        },
        bindEvent: function() {
          var self = this, info = self.info;
          if(!util.validateTel(info.tel)){
            $("#pmInput").val(info.tel);
          }

          $("#pmInput")[0].focus();
          var url = "/rest/supplier/updateSelf";
          var data = {};
          if(info.id){
            url = "/rest/supplier/updateEmployee";
            data.id = info.id;
          };
          $("#pmBtnSave").on("click", function() {
            var telVal = $("#pmInput").val().trim();
            if(util.validateTel(telVal)){
              alert("手机号格式不正确");
              return;
            }

            $load.removeClass("hidden");
            util.extend(data, {
              name: info.name,
              phone: telVal
            });
            $.ajax({
              type: "GET",
              url: root + url,
              data: data,
              dataType: "json",
              contentType: "application/json;charset=UTF-8",
              success: function(data) {
                $load.addClass("hidden");
                // util.messageBoxTips(),
                // $("#common-msg-btn").on("click", function() {
                //   util.messageBox.hide();
                  history.back();
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
      accountModifyPhone.init();
    }(window);