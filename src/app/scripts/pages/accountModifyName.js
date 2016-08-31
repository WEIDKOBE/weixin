/*
* @Author: WD
* @Date:   2016-06-29 13:38:24
* @Last Modified by:   WD
* @Last Modified time: 2016-06-29 13:39:23
*/

'use strict';

 !function(win) {
      var accountModifyName = {
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
          // util.updateTitle('修改姓名');
        },
        bindEvent: function() {
          var self = this, info = self.info;
          info.name && $("#pmInput").val(info.name);

          $("#pmInput")[0].focus();
          var url = "/rest/supplier/updateSelf";
          var data = {};
          if(info.id){
            url = "/rest/supplier/updateEmployee";
            data.id = info.id;
          };
          $("#pmBtnSave").on("click", function() {
            var nameVal = $("#pmInput").val().trim();
            if(!nameVal){
              alert("姓名不能为空");
              return;
            }

            $load.removeClass("hidden");
            util.extend(data, {
              name: nameVal,
              phone: info.tel
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
      accountModifyName.init();
    }(window);