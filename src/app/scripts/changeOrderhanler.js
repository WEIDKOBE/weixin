/**
 * Created by liuchuan.gu on 16/1/27.
 */
(function(win){

    var changeOrderhandler={
        getParams: function(){
            return util.getParam(util.getQueryString('info'));
        },
        getSaleSupplier:function(info){
            var self = this;
            $.ajax({
                url:root + '/rest/supplier/getALLEmployeeByHotelId',
                type: 'GET',
                dataType: 'json',
                contentType:'application/json;charset=UTF-8',
                data: {
                    hotelId:info.hotelId
                },
                success: function(result) {
                    // console.log(result);
                    if(result.accounts!=null&&result.accounts.length>0){
                        var data = result.accounts;
                        data.id = util.cookie.getItem("_supplierId");
                        self.render(data);
                    }
                    //self.bindEvent();
                    // 隐藏loading
                    $load.addClass('hidden');
                }
            });
        },
        bindEvent: function(){
            var self = this;
            $('#saleSupplierList').on('click','.aohItem1', function(){
                $(this).addClass('selected').siblings('.aohItem1').removeClass('selected');
                return false;
            });
            $('#btn_save_change_handler').on('click', function(){
                var name = $("#saleSupplierList").find('.selected').data('name');
                $('#common_title').text('把订单转交给'+name+"吗?");
                util.messageBox();
            });
            $('.common-msg-cancel').on('click', function(){
                util.messageBox.hide();
            });

            $('.aohIcon_send_message').on('click',function(){
                var aohIcon= $('#aohIcon_send_message');
                if(aohIcon.hasClass('aohIcon_send_message_Select')){
                    aohIcon.removeClass('aohIcon_send_message_Select');
                } else {
                    aohIcon.addClass('aohIcon_send_message_Select');
                }
            }),

            $('.common-msg-ok').on('click', function(){
                util.messageBox.hide();
                self.changeHanderSupplier(self.info);
            });
        },

        /**
         * 更新
         */
        changeHanderSupplier:function(info){
            var dataid = $("#saleSupplierList").find('.selected').data('id');
            var aohIcon= $('#aohIcon_send_message');
            var isSendMessage=false;
            if(aohIcon.hasClass('aohIcon_send_message_Select')){
                isSendMessage = true;
            }
            $.ajax({
                    url:root + '/rest/order/changeHandlerSupplier',
                    type: 'GET',
                    dataType: 'json',
                    contentType:'application/json;charset=UTF-8',
                    data: {
                        supplierId:dataid,
                        orderId:info.orderId,
                        isSendMessage:isSendMessage
                    },
                success: function(result) {
                    if(result.returnCode = 100){
                        // alert('提交成功');
                        history.back();
                    } else {
                        $load.addClass('hidden');
                        alert(result.msg);
                    }
                }
            });
        },

        render: function(data){
            var untmpl = $('#saleSupplierTemplate').html();
            var render = doT.template(untmpl);
            var html_un = render(data);
            $('#saleSupplierList').html(html_un);
        },
        init: function(){
            var self = this;
            var info = self.getParams();
            self.info = info;
            self.getSaleSupplier(info);
            self.bindEvent();
        }
    }

    changeOrderhandler.init();
})(window);