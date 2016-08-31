;(function(win){
      $('.weui_icon_search').on('click',function(){

      var val = $('#nope').val();
      console.log(val);

      $.ajax({
        url:root + '/rest/hotel/list/query?hotelname='+val,
        type: 'POST',
        dataType: 'json',
        contentType:'application/json;charset=UTF-8',
        success: function(result) {
          var length = result.hotelList.length;
          console.log(result.hotelList[0].name);
          console.log(result.hotelList);

        //window.location.href = 'hotelList.html';
      }

    });


});

})(window)